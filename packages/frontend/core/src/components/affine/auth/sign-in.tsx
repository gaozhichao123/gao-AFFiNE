import { AuthInput, ModalHeader } from '@affine/component/auth-components';
import { Button } from '@affine/component/ui/button';
import { useAsyncCallback } from '@affine/core/hooks/affine-async-hooks';
import { getUserQuery } from '@affine/graphql';
import { Trans } from '@affine/i18n';
import { useAFFiNEI18N } from '@affine/i18n/hooks';
import { ArrowDownBigIcon } from '@blocksuite/icons';
import type { FC } from 'react';
import { useCallback, useState } from 'react';

import { useCurrentLoginStatus } from '../../../hooks/affine/use-current-login-status';
import { useMutation } from '../../../hooks/use-mutation';
import { emailRegex } from '../../../utils/email-regex';
import type { AuthPanelProps } from './index';
import * as style from './style.css';
import { useAuth } from './use-auth';
import { useCaptcha } from './use-captcha';
import { useSubscriptionSearch } from './use-subscription';

function validateEmail(email: string) {
  return emailRegex.test(email);
}

export const SignIn: FC<AuthPanelProps> = ({
  setAuthState,
  setAuthEmail,
  email,
  onSignedIn,
}) => {
  const t = useAFFiNEI18N();
  const loginStatus = useCurrentLoginStatus();
  const [verifyToken, challenge] = useCaptcha();
  const subscriptionData = useSubscriptionSearch();
  const [phone, setPhone] = useState<number | null>(0);

  const {
    isMutating: isSigningIn,
    resendCountDown,
    allowSendEmail,
    signIn,
    signUp,
  } = useAuth();

  const { trigger: verifyUser, isMutating } = useMutation({
    mutation: getUserQuery,
  });
  // const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPhone, setIsValidPhone] = useState(true);

  if (loginStatus === 'authenticated') {
    onSignedIn?.();
  }

  /* const onContinue = useAsyncCallback(async () => {
    if (!allowSendEmail) {
      return;
    }

    if (!validateEmail(email)) {
      setIsValidEmail(false);
      return;
    }

    setIsValidEmail(true);
    // 0 for no access for internal beta
    const user: GetUserQuery['user'] | null | 0 = await verifyUser({ email })
      .then(({ user }) => user)
      .catch(err => {
        if (findGraphQLError(err, e => e.extensions.code === 402)) {
          setAuthState('noAccess');
          return 0;
        } else {
          throw err;
        }
      });

    if (user === 0) {
      return;
    }
    setAuthEmail(email);

    if (verifyToken) {
      if (user) {
        // provider password sign-in if user has by default
        //  If with payment, onl support email sign in to avoid redirect to affine app
        if (user.hasPassword && !subscriptionData) {
          setAuthState('signInWithPassword');
        } else {
          mixpanel.track_forms('SignIn', 'Email', {
            email,
          });
          const res = await signIn(email, verifyToken, challenge);
          if (res?.status === 403 && res?.url === INTERNAL_BETA_URL) {
            return setAuthState('noAccess');
          }
          // TODO, should always get id from user
          if ('id' in user) {
            mixpanel.identify(user.id);
          }
          setAuthState('afterSignInSendEmail');
        }
      } else {
        const res = await signUp(email, verifyToken, challenge);
        mixpanel.track_forms('SignUp', 'Email', {
          email,
        });
        if (res?.status === 403 && res?.url === INTERNAL_BETA_URL) {
          return setAuthState('noAccess');
        } else if (!res || res.status >= 400) {
          return;
        }
        setAuthState('afterSignUpSendEmail');
      }
    }
  }, [
    allowSendEmail,
    subscriptionData,
    challenge,
    email,
    setAuthEmail,
    setAuthState,
    signIn,
    signUp,
    verifyToken,
    verifyUser,
  ]); */

  const onContinue = useAsyncCallback(async () => {
    if (!allowSendEmail) {
      return;
    }

    // if (!validateEmail(email)) {
    if (typeof phone !== 'number') {
      // setIsValidEmail(false);
      setIsValidPhone(false);
      return;
    }

    // setIsValidEmail(true);
    setIsValidPhone(true);
    // 0 for no access for internal beta
    // const user: GetUserQuery['user'] | null | 0 = await verifyUser({ email })
    //   .then(({ user }) => user)
    //   .catch(err => {
    //     console.log('ewwww', err)
    //     if (findGraphQLError(err, e => e.extensions.code === 402)) {
    //       setAuthState('noAccess');
    //       return 0;
    //     } else {
    //       throw err;
    //     }
    //   });

    // if (user === 0) {
    //   return;
    // }
    // setAuthEmail(email);
    console.log('subscriptionData', verifyToken, subscriptionData);
    if (verifyToken) {
      // if (user) {
      // provider password sign-in if user has by default
      //  If with payment, onl support email sign in to avoid redirect to affine app
      // if (user.hasPassword && !subscriptionData) {
      if (!subscriptionData) {
        // setAuthState('signInWithPassword');
        console.log('lalala');
      } else {
        // 登陆模块
        // mixpanel.track_forms('SignIn', 'Email', {
        //   email,
        // });
        // const res = await signIn(email, verifyToken, challenge);
        // if (res?.status === 403 && res?.url === INTERNAL_BETA_URL) {
        //   return setAuthState('noAccess');
        // }
        // TODO, should always get id from user
        // if ('id' in user) {
        //   mixpanel.identify(user.id);
        // }
        setAuthState('afterSignInSendEmail');
      }
    } else {
      // 注册模块
      // const res = await signUp(email, verifyToken, challenge);
      // mixpanel.track_forms('SignUp', 'Email', {
      //   email,
      // });
      // if (res?.status === 403 && res?.url === INTERNAL_BETA_URL) {
      //   return setAuthState('noAccess');
      // } else if (!res || res.status >= 400) {
      //   return;
      // }
      setAuthState('afterSignUpSendEmail');
    }
  }, [
    allowSendEmail,
    subscriptionData,
    challenge,
    // email,
    // setAuthEmail,
    setAuthState,
    signIn,
    signUp,
    verifyToken,
    // verifyUser,
  ]);

  return (
    <>
      <ModalHeader
        title={t['com.affine.auth.sign.in']()}
        subTitle={t['com.affine.brand.affineCloud']()}
      />

      <div className={style.authModalContent}>
        <AuthInput
          // label={t['com.affine.settings.email']()}
          // placeholder={t['com.affine.auth.sign.email.placeholder']()}
          label={'手机号'}
          placeholder={'请输入手机号'}
          // value={email}
          value={String(phone)}
          onChange={useCallback(
            (value: string) => {
              console.log('vaaaa', value);
              // setAuthEmail(value);
              setPhone(Number(value));
            },
            // [setAuthEmail]
            [setPhone]
          )}
          // error={!isValidEmail}
          errorHint={isValidPhone ? '' : '无效手机号码'}
          onEnter={onContinue}
        />

        {/* {verifyToken ? null : <Captcha />} */}

        <Button
          size="extraLarge"
          data-testid="continue-login-button"
          block
          loading={isMutating || isSigningIn}
          // disabled={!allowSendEmail}
          icon={
            <ArrowDownBigIcon
              width={20}
              height={20}
              style={{
                transform: 'rotate(-90deg)',
                color: 'var(--affine-blue)',
              }}
            />
          }
          iconPosition="end"
          onClick={onContinue}
        >
          {'提交'}
        </Button>

        <div className={style.authMessage}>
          {/*prettier-ignore*/}
          <Trans i18nKey="com.affine.auth.sign.message">
              By clicking &quot;Continue with Google/Email&quot; above, you acknowledge that
              you agree to AFFiNE&apos;s <a href="https://affine.pro/terms" target="_blank" rel="noreferrer">Terms of Conditions</a> and <a href="https://affine.pro/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>.
          </Trans>
        </div>
      </div>
    </>
  );
};
