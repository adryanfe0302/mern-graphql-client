import React, { useState } from 'react'
import { Button, Icon, Confirm, Popup } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { FETCH_POSTS_QUERY } from '../util/graphql'

function DeleteButton({ postId, commentId, callback }){
  
    const [confirmOpen, setConfirmOpen] = useState(false)

    // dynamic delete mutation
    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

    const [deletePostOrComment] = useMutation(mutation, {
        update(proxy){
            setConfirmOpen(false)

            if(!commentId){
                // read cache local
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                })

                console.log('proxy data', data)

                // remove post based on id 
                data.getPosts = data.getPosts.filter((post) => post.id !== postId)

                console.log('proxy data 2', data)

                // write post to local
                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data
                })
            } else {
                
            }
            // we only call callback if parent component has its function
            if(callback) {
                callback()
            }

        },
        variables: {
            postId,
            commentId
        }
    })

    return (
        <>
            <Popup
            content={commentId ? 'delete comment' : 'delete post'}
            inverted
            trigger={
            <Button 
            as="div" 
            color="red" 
            floated="right" 
            onClick={() => setConfirmOpen(true)}>
                <Icon name="trash" style={{margin: '0px'}} />
            </Button>
            } />
            <Confirm 
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePostOrComment}
            />
        </>
    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment(
        $postId: ID!,
        $commentId: ID!
    ){
        deleteComment(
            postId: $postId,
            commentId: $commentId
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

export default DeleteButton

