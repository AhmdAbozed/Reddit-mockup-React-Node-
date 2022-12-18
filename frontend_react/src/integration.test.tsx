// import dependencies
import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import fetch from 'node-fetch-commonjs';
// import react-testing methods
import { render, waitFor, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom'
import CreatePost from './components/CreatePost'
import App from './App';
// necessary for .json() decoding
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

//@ts-ignore
global.fetch = fetch;

test('Signing Up. [Integration Test]', async () => {
  const user = userEvent.setup()
  const element = render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path='/' element={<App />} />
      </Routes>
    </MemoryRouter>
  )

  
  await user.click(screen.getByLabelText("sign in"))
  await user.click(screen.getByLabelText("sign up"))
  await user.type(screen.getByLabelText("Email"), "integration@test.com")
  await user.click(screen.getByLabelText("submit email"))
  await user.type(screen.getByLabelText("Username"), "Int_Test_Username")
  await user.type(screen.getByLabelText("Password"), "Int_Test_Password")
  await user.click(screen.getByLabelText("signup submit"))
  await waitFor(()=>{
    expect(screen.getByTestId("result").innerHTML).toBe("200. Response recieved")
  })

  await waitFor(()=>{
    expect(1+1).toBe(2)
  })
})

test('Signing In. [Integration Test]', async () => {
  const user = userEvent.setup()
  const element = render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path='/' element={<App />} />
      </Routes>
    </MemoryRouter>
  )

  
  await user.click(screen.getByLabelText("sign in"))
  await user.type(screen.getByLabelText("Username"), "Int_Test_Username")
  await user.type(screen.getByLabelText("Password"), "Int_Test_Password")
  await user.click(screen.getByLabelText("signin submit"))
  await waitFor(()=>{
    expect(screen.getByTestId("result").innerHTML).toBe("200. Response recieved")
  })
})


test('Post creation. [Integration Test]', async () => {
  const user = userEvent.setup()
  const element = render(
    <MemoryRouter initialEntries={['/subreddits/1/createPost']}>
      <Routes>
        <Route path='/subreddits/:id/createPost' element={<CreatePost />} />
      </Routes>
    </MemoryRouter>
  )

  await user.type(screen.getByLabelText("title"), "title 3.0")
  await user.type(screen.getByLabelText("description"), "sil vou plea")
  await user.click(screen.getByLabelText("submit post"))
  await waitFor(()=>{
    expect(screen.getByTestId("testElement").innerHTML).toBe("200. Response recieved")
  })

  //console.log((screen.getByLabelText("description") as HTMLInputElement).value)

  //console.log(screen.getAllByTestId("testElement")[0].innerHTML)


})
