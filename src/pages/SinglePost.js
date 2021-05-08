import React, { useContext, useState, useRef } from 'react'
import gql from 'graphql-tag'
import moment from 'moment'
import { useQuery } from '@apollo/react-hooks'
import { AuthContext } from './../context/auth'
import { useMutation } from '@apollo/react-hooks'
import { Grid, Image, Icon, Label, Button, Card, Form } from 'semantic-ui-react'
import { LikeButton } from '../components/LikeButton'  
import DeleteButton from '../components/DeleteButton'

function SinglePost(props){
    const postId = props.match.params.postId
    const { user  } = useContext(AuthContext)
    const [comment, setComment] = useState('')

    const createRefInput = useRef(null)
    console.log('postId', postId)

    const { data: { getPost } = {}} = useQuery(FETCH_POST_QUERY, {
        variables: { postId }
    })    

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update(proxy,result){

            setComment('')
            createRefInput.current.blur()
        },
        variables: {
            postId,
            body: comment
        }
    })

    const deletePostCallback = () => {
        props.history.push('/')
    }

    let postMarkup;
    if(!getPost){
        postMarkup = <div> loading post... </div>
    } else {
        const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = getPost
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image 
                            src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                            size="small"
                            float="rigth"
                            />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header> {username} </Card.Header>
                                <Card.Meta>
                                    {moment(createdAt).fromNow()}
                                </Card.Meta>
                                <Card.Description>
                                    {body}
                                </Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton user={user} post={{ id, likeCount, likes }} />
                                <Button as="div"
                                labelPosition="right"
                                onClick={() => {
                                    console.log('comment post')
                                }}
                                >
                                    <Button basic color="blue"> 
                                        <Icon name="comments" />
                                    </Button>
                                    <Label basic color="blue" pointing="left"> 
                                    {commentCount}
                                    </Label>
                                </Button>
                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallback}/>
                                )}
                                
                            </Card.Content>
                        </Card>
                        {user && <Card fluid> 
                            <Card.Content>
                            <p> post comment </p>
                            <Form>
                                <div className="ui action input fluid">
                                    <input type="text"
                                    placeholder="comment..."
                                    naem="comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    ref={createRefInput}
                                    />
                                    <button type='submit'
                                    className="ui button teal"
                                    disabled={comment.trim() === ''}
                                    onClick={submitComment}
                                    >
                                        submit
                                    </button>
                                </div>
                            </Form>
                            </Card.Content>
                        </Card>}
                        {comments.map(comment => {
                            return <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === username && (
                                        <DeleteButton postId={id} commentId={comment.id}
                                        />
                                    )}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>
                                        {moment(comment.createdAt).fromNow()}
                                    </Card.Meta>
                                    <Card.Description>
                                        {comment.body}
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        })}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }

    return postMarkup
}

const FETCH_POST_QUERY = gql`
    query($postId: ID!){
        getPost(postId:$postId){
            id body createdAt username likeCount commentCount
            likes{
                username
            }
            comments{
               id username createdAt body
            }
        }
    }
`

const SUBMIT_COMMENT_MUTATION = gql`
    mutation createComment($postId: String!, $body: String!){
        createComment(
            postId: $postId,
            body: $body
        ){
            id body createdAt username likeCount commentCount
            likes{
                id username createdAt
            }
            comments{
                id body username createdAt
            }
        }
    }
`

export default SinglePost