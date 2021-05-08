import React, { useState, useContext } from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { Form, Button } from 'semantic-ui-react'
import { useForm } from './../util/hooks'
import { AuthContext } from './../context/auth'

const Register = (props) => {
    const context = useContext(AuthContext)
    const { onChange, onSubmit, values } = useForm(registerUser,  {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [errors, setErrors] = useState('')

    const [addUser, { loading }] = useMutation( REGISTER_USER, {
        // this is the result data

        // it could be like this
        // update(proxy, result){
        //     props.history.push('/')
        // },
        // or
        update(proxy, { data: { register: userData } }){
            // login use the same function with register
            context.login(userData)
            props.history.push('/')
        },

        // catch error
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        // params
        variables: {
            username: values.username,
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword
        },
       
    })

   function registerUser(){
        addUser()
   }


    return <div className='form-container'>
        <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
            <h1> Register </h1>
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
                label="Email"
                placeholder="Email..."
                name="email"
                type="email"
                onChange={onChange}
                error={errors.email ? true : false}
                values={values.email}
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
            <Form.Input
                label="Confirm Password"
                placeholder="Confirm Password..."
                name="confirmPassword"
                type="password"
                onChange={onChange}
                error={errors.confirmPassword ? true : false}
                values={values.confirmPassword}
            />
           <Button type='submit' primary> 
                Register
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

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ){
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ){
            # return
            id
            email
            token
            createdAt
            username
        }
    }
`

export default Register