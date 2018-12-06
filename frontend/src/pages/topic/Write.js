import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
  InputGroup,
  Input,
  Button
} from 'reactstrap'

class Write extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      boardDomain: 'talk',
      category: '',
      title: '',
      content: '',
      isNotice: false
    }
  }

  send = async () => {
    const {
      loading,
      boardDomain,
      category,
      title,
      content,
      isNotice
    } = this.state
    if (loading) return
    this.setState({
      loading: true
    }, async () => {
      const token = sessionStorage.token
      if (!token) return toast.error('토큰을 새로 발급하세요.')
      const response = await axios.post(`/api/topic/write`, {
        boardDomain,
        category,
        title,
        content,
        isNotice
      }, {
        headers: { 'x-access-token': token }
      })
      const data = await response.data
      console.log(data)
      this.setState({
        loading: false
      }, () => {
        console.log('종료')
      })
    })
  }

  setTitle = (e) => {
    this.setState({ title: e.target.value })
  }

  setContent = (e) => {
    this.setState({ content: e.target.value })
  }

  render() {
    return (
      <>
        <InputGroup>
          <Input
            placeholder='title'
            onChange={this.setTitle}
          />
        </InputGroup>
        <br />
        <InputGroup>
          <Input
            placeholder='content'
            onChange={this.setContent}
          />
        </InputGroup>
        <br />
        <Button
          color='primary'
          onClick={this.send}
        >
          전송
        </Button>
      </>
    )
  }
}

export default Write