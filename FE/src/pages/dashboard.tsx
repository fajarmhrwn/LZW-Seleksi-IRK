import React,{useState} from 'react'
import axios from "axios"
import download from 'downloadjs'
import { useStateContext } from '../contexts/ContextProvider'
import { Navigate } from "react-router-dom";
import { Button,Stack, Text,Switch } from '@chakra-ui/react'
import { DownloadIcon,ArrowForwardIcon } from '@chakra-ui/icons'
import Navbars from '../components/Navbar';

const input = () => {
    const {currentUser, token} = useStateContext();
    if(!token){
        return <Navigate to="/login"/>
    }
    const [text,setText] = useState('')
    const [file,setFile] = useState('')
    const [extension,setExtension] = useState<Boolean>(false)
    const [compressed,setCompressed] = useState('')

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          const file = e.target.files[0];
          const reader = new FileReader();
      
          reader.onload = (event) => {
            const fileContent = event.target?.result as string;
            setFile(fileContent);
          };
      
          reader.readAsText(file);
        }
    };

    const handleCompress = () => {
        console.log(currentUser.email)
        if (text) {
            // compress text
            if(extension){
                // compress with extension
                axios.post('https://lzw-seleksi-irk.up.railway.app/encoder-extension', {
                    data: text,
                    email: currentUser.email
                }).then((res) => {
                    setCompressed(res.data)
                }).catch((err) => {
                    console.log(err)
                })
            }else{
                axios.post('https://lzw-seleksi-irk.up.railway.app/encoder', {
                    data: text,
                    email: currentUser.email
                }).then((res) => {
                    setCompressed(res.data)
                }).catch((err) => {
                    console.log(err)
                })
            }
        } else if (file) {
            // compress file
            if(extension){
                // compress with extension
                axios.post('https://lzw-seleksi-irk.up.railway.app/encoder-extension', {
                    data: file,
                    email: currentUser.email
                }).then((res) => {
                    setCompressed(res.data)
                }).catch((err) => {
                    console.log(err)
                })
            }else{
                // compress without extension
                axios.post('https://lzw-seleksi-irk.up.railway.app/encoder', {
                    data: file,
                    email: currentUser.email
                }).then((res) => {
                    setCompressed(res.data)
                }).catch((err) => {
                    console.log(err)
                })
            }
        } else {
            // error

        }
    }

    const handleDecompress = () => {
        if (text) {
            // decompress text
            if(extension){
                // decompress with extension
                axios.post('https://lzw-seleksi-irk.up.railway.app/decoder-extension', {
                    data: text,
                    email: currentUser.email
                }).then((res) => {
                    setCompressed(res.data)
                }).catch((err) => {
                    console.log(err)
                })
            }else{
                // decompress without extension
                axios.post('https://lzw-seleksi-irk.up.railway.app/decoder', {
                    data: text,
                    email: currentUser.email
                }).then((res) => {
                    setCompressed(res.data)
                }).catch((err) => {
                    console.log(err)
                })
            }
        } else if (file) {
            // decompress file
            if(extension){
                // decompress with extension
                axios.post('https://lzw-seleksi-irk.up.railway.app/decoder-extension', {
                    data: file,
                    email: currentUser.email
                }).then((res) => {
                    setCompressed(res.data)
                }).catch((err) => {
                    console.log(err)
                })
            }else{
                // decompress without extension
                axios.post('https://lzw-seleksi-irk.up.railway.app/decoder', {
                    data: file,
                    email: currentUser.email
                }).then((res) => {
                    setCompressed(res.data)
                }).catch((err) => {
                    console.log(err)
                })
            }
        } else {
            // error
        }
    }

    const handleDownload = () => {
        // download file
        if(compressed){
            download(compressed,'compressed.txt','text/plain')
        }else{
            // error
        }
    }

  return (
    <>
        <Navbars/>
        <div className='flex flex-col justify-center items-center h-screen gap-8 overflow-auto'>
                <h1 className='font-heading text-4xl text-teal-600	'>
                    (De)Compress Text with LWT Algorithm
                </h1>
                <div>
                    <textarea className='w-96 h-48 border-2 rounded-md p-2' placeholder='Input text here...' onChange={handleTextChange}/>
                    <p>or, choose a file to upload</p>
                    <input type='file' accept='.txt' onChange={handleFileChange}/>
                    <p>Accepted file type : txt</p>
                </div>
                <Stack direction='row' spacing={4}>
                    <Button leftIcon={<ArrowForwardIcon />} colorScheme='teal' variant='solid' onClick={handleCompress}>
                        Compress
                    </Button>
                    <Button rightIcon={<ArrowForwardIcon />} colorScheme='teal' variant='outline' onClick={handleDecompress}>
                        Decompress
                    </Button>
                </Stack>
                <div className='flex gap-4'>
                    <p>Enable Extension Compression ?</p>
                    <Switch size='lg' colorScheme='teal' onChange={() => {setExtension(!extension)}}/>
                </div>
                <div className={!compressed ? 'hidden' : 'block'}>
                    <div className='w-96 h-72 border-2 rounded-md overflow-auto mb-2'>
                        <Text className='p-2'>
                            {compressed}
                        </Text>
                    </div>
                    <Button leftIcon={<DownloadIcon/>} colorScheme='teal' variant='solid' onClick={handleDownload}>
                        Download
                    </Button>
                </div>
        </div>
    </>
)
}

export default input