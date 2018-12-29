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
  Card,
  Select
} from '@material-ui/core'
import { Editor } from '@tinymce/tinymce-react'
import { HashLoader } from 'react-spinners'

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
      isNotice: false,
      images: [],
      selectedImageDeletehash: ''
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

  append = (text) => {
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
      isNotice,
      images
    } = this.state
    if (loading) return
    if (title === '' || content === '') return toast.error('빈 칸을 입력하세요.')
    this.setState({
      loading: true
    }, async () => {
      const token = localStorage.token
      if (!token) return toast.error('토큰을 새로 발급하세요.')
      const response = await axios.post(`/api/topic/write`, {
        domain,
        category,
        title,
        content,
        isNotice,
        images
      }, {
          headers: { 'x-access-token': token }
        })
      const data = await response.data
      this.setState({
        loading: false
      })
      if (data.status === 'fail') return toast.error(data.message)
      toast.success('글 작성 성공!')
      this.props.history.push(`/b/${domain}/${data.topicId}`)
    })
  }

  imageUpload = async e => {
    const { loading } = this.state
    if (loading) return
    const token = localStorage.token
    if (!token) return toast.error('토큰을 새로 발급하세요.')
    this.setState({ loading: true })
    let files = []
    for (const file of e.target.files)
      files.push(file)
    await this.imageUploadToImgur(files)
  }

  imageUploadToImgur = async (files, index = 0) => {
    const { REACT_APP_CLIENT_ID } = process.env
    const formData = new FormData()
    formData.append('type', 'file')
    formData.append('image', files[index])
    const response = await axios.post('https://api.imgur.com/3/upload.json',
      formData,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Client-ID ${REACT_APP_CLIENT_ID}`
        }
      }
    )
    const data = await response.data
    if (data.success) {
      const name = files[index].name
      toast.success(`${index}번째 이미지 (${name}) 업로드 성공!`)
      this.setState({
        images: [
          ...this.state.images,
          {
            name,
            link: data.data.link,
            deletehash: data.data.deletehash
          }
        ],
        selectedImageDeletehash: data.data.deletehash
      }, () => {
        this.append(`<p><img src='${data.data.link}' data-deletehash='${data.data.deletehash}'></p><p></p>`)
      })
    } else {
      toast.error(`${index}번째 이미지 업로드 실패...`)
    }
    if (index === files.length - 1) return this.setState({ loading: false })
    await this.imageUploadToImgur(files, index + 1)
  }

  imageRemove = async deletehash => {
    const { REACT_APP_CLIENT_ID } = process.env
    this.setState({ loading: true })
    const response = await axios.delete(`https://api.imgur.com/3/image/${deletehash}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Client-ID ${REACT_APP_CLIENT_ID}`
      }
    })
    const data = await response.data
    this.setState({ loading: false })
    if (!data.success) return toast.error('이미지 삭제 실패...')
    console.log(this.state.images.filter((item, index) => index === 0)[0].deletehash)
    const newDeletehash = this.state.images.length > 0 ? this.state.images.filter((item, index) => index === 0)[0].deletehash : ''
    this.setState({
      images: this.state.images.filter(i => i.deletehash !== deletehash),
      selectedImageDeletehash: newDeletehash
    })
  }

  imageRemoveAll = async () => {
    const { REACT_APP_CLIENT_ID } = process.env
    this.setState({ loading: true })
    const promise = this.state.images.map((item) => {
      return axios.delete(`https://api.imgur.com/3/image/${item.deletehash}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Client-ID ${REACT_APP_CLIENT_ID}`
        }
      })
        .then(() => {
          return item.deletehash
        })
    })
    Promise.all(promise)
      .then(data => {
        data.map(deletehash => this.setState({ images: this.state.images.filter(i => i.deletehash !== deletehash) }))
      })
      .then(() => {
        this.setState({ loading: false })
      })
  }

  setselectedImageDeletehash = e => {
    this.setState({ selectedImageDeletehash: e.target.value })
  }

  selectedImageRemove = async () => {
    const { selectedImageDeletehash } = this.state
    if (selectedImageDeletehash === '') return toast.error('선택된 객체가 없습니다.')
    await this.imageRemove(selectedImageDeletehash)
  }

  setTitle = (e) => {
    this.setState({ title: e.target.value })
  }

  setContent = (e) => {
    this.setState({ content: e.target.value })
  }

  render() {
    const { classes } = this.props
    const { loading, title, images, selectedImageDeletehash } = this.state
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
          <HashLoader
            sizeUnit='px'
            size={80}
            margin='2px'
            color='#4A4A4A'
            loading={loading}
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
            autoFocus
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
              //language: 'ko_KR',
              menubar: false,
              height: 360,
              plugins: 'code link media image table textcolor',
              toolbar: 'undo redo | styleselect | fontsizeselect forecolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table link media custom_image code'
            }}
            onChange={this.handleEditorChange}
          />
        </FormControl>
        <div style={{ margin: '1rem 0' }}>
          <input
            type='file'
            multiple='multiple'
            id='fileBrowser'
            label='이곳에 이미지를 올려보세요!'
            onChange={this.imageUpload}
          />
          {images.length > 0 && (
            <>
              <Select
                multiple
                native
                value={selectedImageDeletehash}
                onChange={this.setselectedImageDeletehash}
              >
                {images.map(i => {
                  return (
                    <option key={i.deletehash} value={i.deletehash}>{i.name}</option>
                  )
                })}
              </Select>
              <Button
                variant='contained'
                color='primary'
                onClick={this.selectedImageRemove}
              >
                선택 이미지 삭제
              </Button>
            </>
          )}
          <Button
            variant='contained'
            color='primary'
            onClick={this.imageRemoveAll}
          >
            이미지 전부 삭제
          </Button>
        </div>
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