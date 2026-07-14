import React from 'react'

const Login = () => {
  return (
    <div>
      <form action="post">
        <div>
      <label htmlFor="email">email address</label>  <input type="text" placeholder='johnDoe@example.com' />
      </div>
      <div>
      <label htmlFor="email">Password</label>  <input type="password" placeholder='***' />
      </div>
        <div>
            Don't have an account ? 
        </div>

      </form>
    </div>
  )
}

export default Login
