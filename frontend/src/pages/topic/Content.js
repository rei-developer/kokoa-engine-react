import React from 'react'
import axios from 'axios'

class Content extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: 0,
            topic: []
        }
    }

    componentWillMount() {
        const id = this.props.match.params.id
        this.setState({ id }, () => { this.getTopic() })
    }

    componentWillReceiveProps(nextProps) {
        const id = nextProps.match.params.id
        this.setState({ id }, () => { this.getTopic() })
    }

    getTopic = async () => {
        const { id } = this.state
        console.log(`/api/topic/read/${id}`)
        const response = await axios.get(`/api/topic/read/${id}`)
        const data = await response.data
        console.log(data)
    }

    render() {
        console.log("C")
        const { id, topic } = this.state
        return (
            <div>
                {id}
                {topic}
            </div>
        )
    }
}

export default Content