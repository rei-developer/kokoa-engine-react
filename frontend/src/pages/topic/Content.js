import React from 'react'
import axios from 'axios'

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
    const id = this.props.match.params.id
    this.getTopic(id)
  }

  componentWillReceiveProps(nextProps) {
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