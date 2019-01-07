import React from 'react'
import { ScaleLoader } from 'react-spinners'
import { Collapse } from '@material-ui/core'

export default class Spinner extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { loading } = this.props
    const loadingBox = {
      width: '100%',
      padding: '.5rem 0 .3rem',
      background: '#01CEA2'
    }
    const override = {
      width: 40,
      margin: '0 auto'
    }
    return (
      <>
        <Collapse in={loading}>
          <div style={loadingBox}>
            <div className='sweet-loading' style={override}>
              <ScaleLoader
                sizeUnit='px'
                height={20}
                color='#FFF'
              />
            </div>
          </div>
        </Collapse>
      </>
    )
  }
}