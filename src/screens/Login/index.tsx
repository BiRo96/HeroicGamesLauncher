import React, { useState } from 'react'

import { loginPage, sidInfoPage } from 'src/helpers'
import { useTranslation } from 'react-i18next'
import LanguageSelector, {
  FlagPosition
} from 'src/components/UI/LanguageSelector'

import { IpcRenderer } from 'electron'
import Autorenew from '@material-ui/icons/Autorenew'
import Info from '@material-ui/icons/Info'

const storage: Storage = window.localStorage

interface Props {
  refresh: () => Promise<void>
}

export default function Login({ refresh }: Props) {
  const { t, i18n } = useTranslation('login')
  const { ipcRenderer } = window.require('electron') as {
    ipcRenderer : IpcRenderer
  }

  const [input, setInput] = useState('')
  const [status, setStatus] = useState({
    loading: false,
    message: ''
  })
  const { loading, message } = status

  const handleChangeLanguage = (language: string) => {
    storage.setItem('language', language)
    i18n.changeLanguage(language)
  }

  const currentLanguage = i18n.language

  const handleLogin = async (sid: string) => {
    setStatus({
      loading: true,
      message: t('status.logging', 'Logging In...')
    })

    await ipcRenderer.invoke('login', sid).then(async (res) => {
      if (res !== 'error') {
        setStatus({
          loading: true,
          message: t('status.loading', 'Loading Game list, please wait')
        })

        await ipcRenderer.invoke('refreshLibrary')
        refresh()
      }

      setStatus({ loading: true, message: t('status.error', 'Error') })
      setTimeout(() => {
        setStatus({ ...status, loading: false })
      }, 2500)
    })
  }

  return (
    <div className="Login">
      <div className="LoginBackground">
        <div className="LoginBackgroundImage"></div>
        <div className="LoginBackgroundText">
          <div className="heroicLogo">
            <span className="logo" />
            <div className="heroicText">
              <span className="heroicTitle">Heroic</span>
              <span className="heroicSubTitle">Games Launcher</span>
            </div>
          </div>
          <span className="loginInstructions">
            <strong>{t('welcome', 'Welcome!')}</strong>
            <p>
              {t(
                'message.part1',
                'In order for you to be able to log in and install your games, we first need you to follow the steps below:'
              )}
            </p>
            <ol>
              <li>
                {`${t('message.part2')} `}
                <span onClick={() => loginPage()} className="epicLink">
                  {t('message.part3')}
                </span>
                {`${t('message.part4')} `}
                <span onClick={() => sidInfoPage()} className="sid">
                  {`${t('message.part5')}`}
                  <Info
                    style={{ marginLeft: '4px' }}
                    className="material-icons"
                  />
                </span>
                .
              </li>
              <li>
                {`${t('message.part6')} `}
                <span onClick={() => sidInfoPage()} className="sid">
                  {`${t('message.part7')}`}
                </span>
                {` ${t('message.part8')}`}
              </li>
            </ol>
          </span>
        </div>
      </div>
      <div className="LoginPanel">
        <div className="loginWrapper">
          <div className="loginFormWrapper">
            <div className="loginForm">
              <span className="pasteSIDText">{t('input.placeholder', 'Paste the SID number here')}</span>
              <input
                className="loginInput"
                id="sidInput"
                onChange={(event) => setInput(event.target.value)}
              />
              {loading && (
                <p className="message">
                  {message}
                  <Autorenew className="material-icons" />{' '}
                </p>
              )}
              <button
                onClick={() => handleLogin(input)}
                className="button is-primary"
                disabled={loading || input.length < 30}
              >
                {t('button.login', 'Login')}
              </button>
            </div>
          </div>
        </div>
        <span
          className='language-selector-span'
        >
          <LanguageSelector
            handleLanguageChange={handleChangeLanguage}
            currentLanguage={currentLanguage}
            flagPossition={FlagPosition.PREPEND}
            className="settingSelect language-login"
          />
        </span>
      </div>
    </div>

  )
}
