import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import {
  Card,
  Button
} from '@material-ui/core'
import {
  Create
} from '@material-ui/icons'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  shadows: Array(25).fill('none')
})

const styles = theme => ({
  mb: {
    marginBottom: theme.spacing.unit * 2
  },
  card: {
    borderRadius: 0,
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .03)'
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
})

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
      if (data.status === 'fail') return toast.error(data.message)
      this.setState({ ...data })
    })
  }

  reset() {
    this.setState(init)
  }

  render() {
    const { classes } = this.props
    const { loading, id, content } = this.state
    return (
      <MuiThemeProvider theme={theme}>
        <Card className={classes.card}>
          {loading ? "true" : "false"}
          {id}
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </Card>
        <div className={classes.mb} />
      </MuiThemeProvider>
    )
  }
}

Content.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Content)