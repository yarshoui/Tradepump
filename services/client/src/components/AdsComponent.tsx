import React from 'react';

const DEFAULT_AD_CLIENT = 'ca-pub-4950025876386607';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type AdFormat = 'vertical' | 'horizontal' | 'rectangle';
type X = Exclude<AdFormat, 'vertical'>;


interface Props {
  adClient?: string;
  adHost?: string;
  adSlot?: string;
  adFormat?: 'auto' | AdFormat | [AdFormat, AdFormat];
  style?: React.CSSProperties;
  className?: string;
}

export class AdsComponent extends React.Component<Props> {
  static defaultProps: Props = {
    style: {display: 'block'},
  };

  componentDidMount () {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  }

  render () {
    const { adClient, adSlot, adFormat, adHost, style, className } = this.props;
    const classNames = ['adsbygoogle'];

    if (className) {
      classNames.push(className);
    }
    const format = Array.isArray(adFormat) ? adFormat.join(',') : adFormat;

    return (
        <ins className={classNames.join(' ')}
          style={style}
          data-ad-host={adHost}
          data-ad-client={adClient || DEFAULT_AD_CLIENT}
          data-ad-slot={adSlot}
          data-ad-format={format}
        />
    );
  }
}
