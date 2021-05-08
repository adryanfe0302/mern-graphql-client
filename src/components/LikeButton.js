import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { Icon, Label, Button } from 'semantic-ui-react'

export function LikeButton({user, post: { id, likes, likeCount }}) {
    
    const [liked, setLike] = useState(false)
    useEffect(() => {
       if(user && likes.find(like => like.username === user.username)){
           setLike(true)
       } else setLike(false)
    }, [user, likes]) 

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id }
    })

    const likeButton = user ? (
        liked ? <Button color='teal'> <Icon name='heart' /> </Button> 
        : 
        <Button color='teal' basic>
            <Icon name='heart' />
        </Button>
    ) : (
        <Button as={Link} to='/login' color='teal' basic>
        <Icon name='heart' />
        </Button>
        )

    return <Button labelPosition='right' onClick={likePost}>
        {likeButton}
        <Label basic color='teal' pointing='left'>
        {likeCount}
        </Label>
    </Button>
}


const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!){
        likePost(postId: $postId){
            id
            likes{
                id username
            }
            likeCount
        }
    }
`
