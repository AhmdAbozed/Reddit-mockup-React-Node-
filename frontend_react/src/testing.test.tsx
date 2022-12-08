// import dependencies
import React, { useReducer } from 'react'
import {BrowserRouter, MemoryRouter, Routes, Router} from 'react-router-dom'
import fetch from 'node-fetch-commonjs';
// import react-testing methods
import {render, fireEvent, waitFor, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom'
import CreatePost from './components/CreatePost'
//@ts-ignore
global.fetch =  fetch;
test("1+1 = 3?", ()=>{
  expect(1+1).toBe(3);
})
test('trigger some awesome feature when clicking the button', async () => {
    const user = userEvent.setup()
    const element = render(
       
        
      <CreatePost />
        
        
    )
    await user.click(screen.getByTestId("testElement"))
    await user.click(screen.getByLabelText("title"))
    await user.keyboard("titlen")
    await user.type(screen.getByLabelText("description"), "sil vou plea")
    await setTimeout(()=>{}, 100)
    await user.click(screen.getByLabelText("submit post"))
    //console.log((screen.getByLabelText("description") as HTMLInputElement).value)
    
    //console.log(screen.getAllByTestId("testElement")[0].innerHTML)
  

  })