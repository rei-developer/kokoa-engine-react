import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const init = {
  loading: true,
  id: 0,
  userId: 0,
  boardDomain: '',
  originBoardDomain: '',
  category: '',
  author: '',
  title: '',
  content: '',
  ip: '',
  header: '',
  created: '',
  updated: '',
  isImage: false,
  isBest: false,
  isNotice: false
}

class Content extends React.Component {
  constructor(props) {
    super(props)
    this.state = init
  }

  componentWillMount() {

    console.log(this.props.match.params.id)

    const id = this.props.match.params.id
    this.getTopic(id)
  }

  componentWillReceiveProps(nextProps) {


    console.log(nextProps)

    const id = nextProps.match.params.id
    this.reset()
    this.getTopic(id)
  }

  getTopic = (id) => {
    this.setState({
      loading: false,
      id
    }, async () => {
      const response = await axios.get(`/api/topic/read/${id}`)
      const data = await response.data
      if (data.status === 'fail') return toast.error(data.message)
      this.setState({ ...data })
    })
  }

  reset() {
    this.setState(init)
  }

  render() {
    const { loading, id, content } = this.state
    return (
      <div>
        {loading ? "true" : "false"}
        {id}
        {content}
      </div>
    )
  }
}

export default Content