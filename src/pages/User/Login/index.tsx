import { Footer } from '@/components';
import { randomString } from '@/components/Util/common-util';
import Background from '@/pages/User/Login/components/background';
import LoginPage from '@/pages/User/Login/components/login-page';
import RegisterPage from '@/pages/User/Login/components/register-page';
import Title from '@/pages/User/Login/components/title';
import { Helmet } from '@umijs/max';
import { createStyles } from 'antd-style';
import React from 'react';
import Settings from '../../../../config/defaultSettings';

const randomCode = randomString(8);

const Login: React.FC = () => {
  const bgUrl = require('/public/login-bg.png');

  const { styles } = createStyles(({}) => {
    return {
      container: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100vh',
        overflow: 'auto',
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: '100% 100%',
      },
      main: {
        flex: 1,
        padding: '64px 0',
      },
    };
  })();

  const [page, setPage] = React.useState(0);

  return (
    <div className={styles.container}>
      <Background />
      <Helmet>
        <title>
          {'登录'}- {Settings.title}
        </title>
      </Helmet>
      <div className={styles.main}>
        <Title logoSrc="/icons/G.png" title="Gill Platform" subTitle="个人研究与学习使用" />

        {page === 0 && <LoginPage randomCode={randomCode} setPage={setPage} />}
        {page === 1 && (
          <>
            <RegisterPage randomCode={randomCode} setPage={setPage} />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};
export default Login;
