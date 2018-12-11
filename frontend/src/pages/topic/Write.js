import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import {
  Input,
  InputBase,
  InputLabel,
  TextField,
  FormControl
} from '@material-ui/core'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  bootstrapRoot: {
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
  },
  bootstrapInput: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, .25)'
    },
  },
  bootstrapFormLabel: {
    fontSize: 18,
  }
})

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  shadows: Array(25).fill('none'),
  palette: {
    primary: {
      main: '#fff',
      dark: '#fff',
      contrastText: '#3f50b5'
    },
    secondary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff'
    }
  }
})

class Write extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      boardDomain: '',
      category: '',
      title: '',
      content: '',
      isNotice: false
    }
  }

  componentWillMount() {
    const boardDomain = this.props.match.params.boardDomain
    this.setState({
      boardDomain
    })
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
      this.setState({
        loading: false
      })
      if (data.status === 'fail') return toast.error(data.message)
      this.props.history.push(`/b/${boardDomain}/${data.topicId}`)
    })
  }

  setTitle = (e) => {
    this.setState({ title: e.target.value })
  }

  setContent = (e) => {
    this.setState({ content: e.target.value })
  }
/*
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
        */
  render() {
    const { classes } = this.props
    return (
      <>
        <FormControl className={classes.margin} fullWidth>
          <InputLabel shrink htmlFor='bootstrap-input' className={classes.bootstrapFormLabel}>제목</InputLabel>
          <InputBase
            id='bootstrap-input'
            defaultValue='react-bootstrap'
            classes={{
              root: classes.bootstrapRoot,
              input: classes.bootstrapInput
            }}
          />
        </FormControl>
        <FormControl className={classes.margin} fullWidth>
          <InputLabel shrink htmlFor='bootstrap-input' className={classes.bootstrapFormLabel}>내용</InputLabel>
          <InputBase
            id='bootstrap-input'
            defaultValue='react-bootstrap'
            multiline
            rows='15'
            rowsMax='15'
            classes={{
              root: classes.bootstrapRoot,
              input: classes.bootstrapInput
            }}
          />
        </FormControl>
      </>
    )
  }
}

Write.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Write)