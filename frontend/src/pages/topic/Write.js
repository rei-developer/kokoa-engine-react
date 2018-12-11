import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import {
  InputBase,
  InputLabel,
  FormControl,
  Button,
  Card
} from '@material-ui/core'
import { Editor } from '@tinymce/tinymce-react'
import { MoonLoader } from 'react-spinners'

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
    },
  },
  bootstrapInput: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '8px 10px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
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
  shadows: Array(25).fill('none')
})

class Write extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      domain: '',
      category: '',
      title: '',
      content: '',
      isNotice: false
    }
  }

  componentWillMount() {
    const domain = this.props.match.params.domain
    this.setState({
      domain
    })
  }

  handleEditorChange = (e) => {
    this.setState({
      content: e.target.getContent()
    })
  }

  append = () => {
    const text = '<p>test</p>'
    this.setState({
      content: this.state.content + text
    }, () => {
      this.state.editor.setContent(this.state.content)
    })
  }

  send = async () => {
    const {
      loading,
      domain,
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
        domain,
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
      this.props.history.push(`/b/${domain}/${data.topicId}`)
    })
  }

  setTitle = (e) => {
    this.setState({ title: e.target.value })
  }

  setContent = (e) => {
    this.setState({ content: e.target.value })
  }

  render() {
    const { classes } = this.props
    const { title } = this.state
    const override = {
      position: 'absolute',
      width: '78px',
      height: '78px',
      margin: '-39px 0 0 -39px',
      top: '50%',
      left: '50%',
      zIndex: 50000
    }
    return (
      <MuiThemeProvider theme={theme}>
        <div className='sweet-loading' style={override}>
          <MoonLoader
            sizeUnit='px'
            size={60}
            margin='2px'
            color='#36D7B7'
            loading={this.state.loading}
          />
        </div>
        <FormControl className={classes.mb} fullWidth>
          <InputLabel shrink htmlFor='bootstrap-input' className={classes.bootstrapFormLabel}>제목</InputLabel>
          <InputBase
            value={title}
            classes={{
              root: classes.bootstrapRoot,
              input: classes.bootstrapInput
            }}
            onChange={this.setTitle}
          />
        </FormControl>
        <FormControl className={classes.mb} fullWidth>
          <InputLabel shrink htmlFor='bootstrap-input' className={classes.bootstrapFormLabel}>내용</InputLabel>
          <Editor
            apiKey='lb1yt4yj6dls6cpmvksg1dnp32tuhj9xw0rig7nxprz0wj2x'
            cloudChannel='dev'
            init={{
              setup: editor => {
                this.setState({ editor })
              },
              plugins: 'link image code',
              toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
            }}
            onChange={this.handleEditorChange}
          />
        </FormControl>
        <button onClick={this.append}>테스트</button>
        <FormControl fullWidth>
          <Button
            variant='contained'
            color='primary'
            onClick={this.send}
          >
            글쓰기
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