import React, { useState, useContext } from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { Form, Button } from 'semantic-ui-react'
import { useForm } from './../util/hooks'
import { AuthContext } from './../context/auth'

const Login = (props) => {
    const context = useContext(AuthContext)
    const { onChange, onSubmit, values } = useForm(goLoginUser,  {
        username: '',
        password: '',
    })

    const [errors, setErrors] = useState('')

    const [loginUser, { loading }] = useMutation( LOGIN_USER, {
        // this is the result data

        // it could be like this
        // update(proxy, result){
        //     context.login(result)
        //     props.history.push('/')
        // },

        // or
        update(proxy, { data: { login: userData } }){
            context.login(userData)
            props.history.push('/')
        },
        // catch error
        onError(err){
            console.log('err', err)
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        // params
        variables: {
            username: values.username,
            password: values.password,
        }
       
    })

   function goLoginUser(){
       loginUser()
   }

    return  <div className='form-container'> 
     <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
            <h1> Login </h1>
            <Form.Input
                label="Username"
                placeholder="Username..."
                name="username"
                type="text"
                onChange={onChange}
                error={errors.username ? true : false}
                values={values.username}
            />
            <Form.Input
                label="Password"
                placeholder="Password..."
                name="password"
                type="password"
                onChange={onChange}
                error={errors.password ? true : false}
                values={values.password}
            />
            <Button type='submit' primary> 
                Login
           </Button>
        </Form>
        {Object.keys(errors).length > 0 && (
            <div className="ui error message">
                <ul className="list">
                    {Object.values(errors).map((value) => {
                        return <li key={value}> {value} </li>
                    })}
                </ul>
            </div>
        )}
        </div>
}


const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ){
        login(username: $username password: $password){
            # return
            id
            email
            token
            createdAt
            username
        }
    }
`

export default Login