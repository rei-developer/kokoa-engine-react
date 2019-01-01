import React from 'react'

export default class Adsense extends React.Component {
  componentDidMount() {
    const installGoogleAds = () => {
      const elem = document.createElement('script')
      elem.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
      elem.async = true
      elem.defer = true
      document.body.insertBefore(elem, document.body.firstChild)
    }
    installGoogleAds();
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  }

  render() {
    const container = {
      display: 'block',
      maxWidth: 970,
      margin: '0 auto .5rem auto'
    }
    return (
      <ins
        className='adsbygoogle'
        style={container}
        data-ad-client='ca-pub-5633529273423665'
        data-ad-slot='1882412178'
        data-ad-format='auto'
      />
    )
  }
}