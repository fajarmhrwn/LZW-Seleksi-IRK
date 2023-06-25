import React,{useState,useEffect} from 'react'
import { useStateContext } from '../contexts/ContextProvider'
import { Navigate } from "react-router-dom";
import Navbars from '../components/Navbar';
import { Table } from 'flowbite-react';
import axios from 'axios';

interface HistoryData {
    name: string;
    type: string;
    input: string;
    output: string;
    date: string;
    time: string;
}

const History = () => {
    const {currentUser, token} = useStateContext();
    if(!token){
        return (
            <Navigate to="/login" />
        )
    }
    const [data,setData] = useState<HistoryData[]>()

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser')
        let user = null
        if(storedUser){
            user = JSON.parse(storedUser)
        }
        axios.post(`http://localhost:3000/history`,{
            email: user.email
        }).then((res) => {
            setData(res.data)
            console.log(res.data)
        }
        ).catch((err) => {
            console.log(err)
        }
        )
    },[])
  return (
    <>
      <Navbars />
      <div className='h-screen p-4 pt-2'>
      <Table striped>
      <Table.Head>
        <Table.HeadCell>
          Type
        </Table.HeadCell>
        <Table.HeadCell>
          Input
        </Table.HeadCell>
        <Table.HeadCell>
          Output
        </Table.HeadCell>
        <Table.HeadCell>
          Date
        </Table.HeadCell>
        <Table.HeadCell>
          Time
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {
            data?.map((item) => {
                return (
                    <Table.Row>
                        <Table.Cell>
                            {item.type}
                        </Table.Cell>
                        <Table.Cell>
                            {item.input}
                        </Table.Cell>
                        <Table.Cell>
                            {item.output}
                        </Table.Cell>
                        <Table.Cell>
                        {new Date(item.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                        </Table.Cell>
                        <Table.Cell>
                            {item.time}
                        </Table.Cell>
                    </Table.Row>
                )
            })
        }
      </Table.Body>
    </Table>
      </div>
    </>
  )
}

export default History