import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Form, Button } from 'semantic-ui-react'
import { useForm } from '../util/hooks'
import { FETCH_POSTS_QUERY } from '../util/graphql'

function PostForm(){
    const { values, onChange, onSubmit } = useForm(createPostCallback, {
        body: ''
    })

    const [createPost, { error }] = useMutation( CREATE_POST_MUTATION, {
         // params
        variables: values,
        update(proxy, result){
            console.log('proxy', proxy)
           
      
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            console.log('proxy data', data)
            data.getPosts = [result.data.createPost, ...data.getPosts]

            console.log('data.getPosts', data.getPosts)
            proxy.writeQuery({ query: FETCH_POSTS_QUERY, data })
            console.log('data.writeQuery', { query: FETCH_POSTS_QUERY, data })
            values.body = ''
        },     
       
    })

    function createPostCallback(){
        createPost()
    }

    return (
        <>
        <Form onSubmit={onSubmit}>
            <h2> Create a post:</h2>
            <Form.Field>
                <Form.Input
                    placeholder="hi world"
                    name="body"
                    onChange={onChange}
                    value={values.body}
                    error={error ? true : false}
                />
                <Button type="submit" color='teal'>
                    Submit
                </Button>
            </Form.Field>
        </Form>
        {error && (
            <div className="ui error message" style={{marginBottom: '20px'}}>
                <ul className="list">
                    <li>{error.graphQLErrors[0].message}</li>
                </ul>
            </div>
        )}
        </>
    )
}

const CREATE_POST_MUTATION = gql`
    mutation createPost(
        $body: String!
    ){
        createPost(body: $body){
            id body createdAt username 
            comments {
                id body username createdAt
            }
            likes{
                id username createdAt
            } 
            likeCount commentCount
        }
    }
`


export default PostForm