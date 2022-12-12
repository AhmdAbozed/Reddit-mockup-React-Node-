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

//@ts-ignore
global.fetch = fetch;
test("1+1 = 3?", () => {
  expect(1 + 1).toBe(3);
})
test('trigger some awesome feature when clicking the button', async () => {
  const user = userEvent.setup()
  const element = render(
    <MemoryRouter initialEntries={['/subreddits/2/createPost']}>
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