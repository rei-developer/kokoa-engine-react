import React from 'react'

export default class Adsense extends React.Component {
  componentDidMount() {
    const installGoogleAds = () => {
      const elem = document.createElement("script");
      elem.src =
        "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      elem.async = true;
      elem.defer = true;
      document.body.insertBefore(elem, document.body.firstChild);
    };
    installGoogleAds();
    (adsbygoogle = window.adsbygoogle || []).push({});
  }

  render() {
    return (
      <ins className='adsbygoogle'
        style={{ display: 'block' }}
        data-ad-client='ca-pub-5633529273423665'
        data-ad-slot='1882412178'
        data-ad-format='auto' />
    );
  }
}