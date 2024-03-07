import { history } from '@umijs/max';
import { Button, Result } from 'antd';
import React from 'react';
const UnauthPage: React.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle={'抱歉，您没有权限访问该资源。'}
    extra={
      <Button type="primary" onClick={() => history.push('/home')}>
        {'返回首页'}
      </Button>
    }
  />
);
export default UnauthPage;
