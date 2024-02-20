import { useState, useRef } from 'react';
import { Input, Button, Progress, notification } from 'antd';
import { LinkOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import { matchYoutubeUrl } from '../../utils';
import './App.css';

const App = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const nodeRef = useRef(null);

  const onButtonClick = async () => {
    if (matchYoutubeUrl(url)) {
      setIsLoading(true);

      try {
        await axios
          .post(
            'http://localhost:3300/convert',
            {
              url
            },
            {
              responseType: 'blob',
              onUploadProgress: progressEvent => {
                setProgress(Math.round((100 * progressEvent.loaded) / progressEvent.total));
              }
            }
          )
          .then(_ => {
            notification.success({
              message: 'Success',
              description: 'MP3 has been downloaded',
              placement: 'top'
            });
            setIsLoading(false);
            setUrl('');
          });
      } catch (error) {
        setIsLoading(false);
        notification.error({
          message: 'Error',
          description: error.message,
          placement: 'top'
        });
      }
    } else {
      notification.error({
        message: 'Error',
        description: 'Provided URL isn`t correct',
        placement: 'top'
      });
    }
  };

  return (
    <div className="main-wrapper">
      <div className="content-wrapper">
        <h1 className="mb-15">Provide an YT-url</h1>
        <Input
          value={url}
          onChange={event => setUrl(event.target.value)}
          className="mb-15"
          size="medium"
          prefix={<LinkOutlined />}
        />
        <CSSTransition
          nodeRef={nodeRef}
          in={isLoading}
          mountOnEnter
          unmountOnExit
          timeout={400}
          classNames="alert"
        >
          <Progress ref={nodeRef} size="small" type="circle" percent={progress} className="mb-15" />
        </CSSTransition>
        <Button loading={isLoading} onClick={onButtonClick} type="primary" icon={<DownloadOutlined />}>
          Convert and download
        </Button>
      </div>
    </div>
  );
};

export default App;
