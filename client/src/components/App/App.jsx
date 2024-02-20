import { useState } from 'react';
import { Input, Button, Progress } from 'antd';
import { LinkOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import './App.css';

const App = () => {
  const [link, setLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onButtonClick = async () => {
    setIsLoading(true);
    await axios
      .post(
        'http://localhost:3300/convert',
        {
          link
        },
        {
          responseType: 'blob',
          onUploadProgress: progressEvent => {
            setProgress(Math.round((100 * progressEvent.loaded) / progressEvent.total));
          }
        }
      )
      .then(res => {
        console.log(res);
        setIsLoading(false);
      });
  };

  return (
    <div className="main-wrapper">
      <div className="content-wrapper">
        <h1 className="mb-15">Provide an YT-link</h1>
        <Input
          value={link}
          onChange={event => setLink(event.target.value)}
          className="mb-15"
          size="medium"
          prefix={<LinkOutlined />}
        />
        {isLoading && <Progress size="small" type="circle" percent={progress} className="mb-15" />}
        <Button loading={isLoading} onClick={onButtonClick} type="primary" icon={<DownloadOutlined />}>
          Convert and download
        </Button>
      </div>
    </div>
  );
};

export default App;
