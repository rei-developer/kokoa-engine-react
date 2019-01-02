import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import {
  InputBase,
  FormControl,
  Button
} from '@material-ui/core'
import { HashLoader } from 'react-spinners'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  shadows: Array(25).fill('none'),
  palette: {
    type: localStorage.mode || 'light',
    primary: {
      main: '#01CEA2',
      contrastText: '#FFF'
    }
  }
})

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  fullWidth: {
    width: '100%'
  },
  mr: {
    marginRight: theme.spacing.unit
  },
  mb: {
    marginBottom: theme.spacing.unit
  },
  pl: {
    paddingLeft: theme.spacing.unit / 2
  },
  pr: {
    paddingRight: theme.spacing.unit / 2
  },
  card: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
    borderRadius: '.25rem',
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .03)'
  },
  bootstrapRoot: {
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    }
  },
  bootstrapInput: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '8px 10px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderColor: '#01CEA2',
      boxShadow: '0 0 0 .2rem rgba(1, 206, 162,.25)'
    }
  },
  bootstrapFormLabel: {
    fontSize: 18
  }
})

class Write extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      content: ''
    }
  }

  send = async () => {
    const {
      loading,
      content
    } = this.state
    if (loading) return
    if (content === '') return toast.error('빈 칸을 입력하세요.')
    const { id } = this.props
    this.setState({
      loading: true
    }, async () => {
      const token = localStorage.token
      if (!token) return toast.error('토큰을 새로 발급하세요.')
      const response = await axios.post(
        `/api/topic/write/post`,
        {
          topicId: id,
          content
        }, {
          headers: { 'x-access-token': token }
        }
      )
      const data = await response.data
      this.setState({
        loading: false,
        content: ''
      })
      if (data.status === 'fail') return toast.error(data.message)
      toast.success('댓글 작성 성공!')
      this.props.onCreate(data.postsCount, data.posts)
    })
  }

  setContent = (e) => {
    this.setState({ content: e.target.value })
  }

  render() {
    const { classes } = this.props
    const { loading } = this.state
    const override = {
      position: 'fixed',
      width: '80px',
      height: '80px',
      margin: '-40px 0 0 -40px',
      top: '50%',
      left: '50%',
      zIndex: 50000
    }
    return (
      <MuiThemeProvider theme={theme}>
        <div className='sweet-loading' style={override}>
          <HashLoader
            sizeUnit='px'
            size={80}
            margin='2px'
            color='#4A4A4A'
            loading={loading}
          />
        </div>
        <FormControl fullWidth>
          <InputBase
            classes={{
              root: classes.bootstrapRoot,
              input: classes.bootstrapInput
            }}
            value={this.state.content}
            placeholder='이곳에 댓글을 입력해주세요.'
            onChange={this.setContent}
            rows={3}
            multiline
          />
        </FormControl>
        <FormControl className={classes.mb} fullWidth>
          <Button
            variant='contained'
            color='primary'
            onClick={this.send}
          >
            작성
          </Button>
        </FormControl>
      </MuiThemeProvider>
    )
  }
}

Write.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Write)