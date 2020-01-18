import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import LinkMui from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import ReactLoading from 'react-loading'

import { MessageSnackBar, BackgroundImages } from '../helpers'
import { handleApiError } from '../services'

import CadastroForm from './cadastro_form'

import styles from './styles'
import validationSchema from './validation_schema'
import { getData, handleCadastro } from './api'

export default withRouter(props => {
  const classes = styles()
  const initialValues = {
    usuario: '',
    senha: '',
    confirmarSenha: '',
    nome: '',
    nomeGuerra: '',
    tipoPostoGradId: '',
    tipoTurnoId: ''
  }

  const [listaTurnos, setListaTurnos] = useState([])
  const [listaPostoGrad, setListaPostoGrad] = useState([])

  const [snackbar, setSnackbar] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let isCurrent = true
    const load = async () => {
      try {
        const response = await getData()
        if (!response || !isCurrent) return

        const { listaPostoGrad, listaTurnos } = response
        setListaPostoGrad(listaPostoGrad)
        setListaTurnos(listaTurnos)
        setLoaded(true)
      } catch (err) {
        if (!isCurrent) return
        handleApiError(err, setSnackbar)
      }
    }
    load()

    return () => {
      isCurrent = false
    }
  }, [])

  const handleForm = async (values, { resetForm }) => {
    try {
      const success = await handleCadastro(
        values.usuario,
        values.senha,
        values.nome,
        values.nomeGuerra,
        values.tipoTurnoId,
        values.tipoPostoGradId
      )
      if (success) {
        resetForm(initialValues)
        setSnackbar({ status: 'success', msg: 'Usuário criado com sucesso. Entre em contato com o gerente para autorizar o login.', date: new Date() })
      }
    } catch (err) {
      resetForm(initialValues)
      handleApiError(err, setSnackbar)
    }
  }

  return (
    <BackgroundImages>
      <div className={classes.overflow}>
        <Container component='main' maxWidth='xs'>
          {loaded ? (
            <Paper className={classes.paper}>
              <Typography component='h1' variant='h5'>
                Cadastro de novo usuário
              </Typography>
              <CadastroForm
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleForm}
                listaTurnos={listaTurnos}
                listaPostoGrad={listaPostoGrad}
              />
              <Grid container justify='flex-end'>
                <Grid item>
                  <LinkMui to='/login' variant='body2' component={Link} className={classes.link}>
                    Fazer login
                  </LinkMui>
                </Grid>
              </Grid>
            </Paper>
          )
            : (
              <div className={classes.loading}>
                <ReactLoading type='bars' color='#F83737' height='40%' width='40%' />
              </div>
            )}
        </Container>
        {snackbar ? <MessageSnackBar status={snackbar.status} key={snackbar.date} msg={snackbar.msg} /> : null}
      </div>
    </BackgroundImages>
  )
})
