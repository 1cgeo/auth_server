import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import { TextField, Select } from 'formik-material-ui'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { SubmitButton, MessageSnackBar } from '../helpers'
import MenuItem from '@material-ui/core/MenuItem'
import ReactLoading from 'react-loading'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { DatePicker } from 'material-ui-formik-components/DatePicker'
import ptLocale from 'date-fns/locale/pt-BR'
import Paper from '@material-ui/core/Paper'

import styles from './styles'
import validationSchema from './validation_schema'
import { getData, handleUpdate } from './api'
import { handleApiError } from '../services'

export default withRouter(props => {
  const classes = styles()

  const [initialValues, setInitialValues] = useState({
    nome: '',
    nomeGuerra: '',
    tipoPostoGradId: '',
    tipoTurnoId: '',
    cpf: '',
    identidade: '',
    validadeIdentidade: null,
    orgaoExpedidor: '',
    banco: '',
    agencia: '',
    contaBancaria: '',
    dataNascimento: null,
    celular: '',
    emailEb: ''
  })

  const [listaTurnos, setListaTurnos] = useState([])
  const [listaPostoGrad, setListaPostoGrad] = useState([])

  const [snackbar, setSnackbar] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    let isCurrent = true

    const load = async () => {
      try {
        const response = await getData()
        if (!response || !isCurrent) return

        const { usuario, listaPostoGrad, listaTurnos } = response
        setInitialValues({
          nome: usuario.nome,
          nomeGuerra: usuario.nome_guerra,
          tipoPostoGradId: usuario.tipo_posto_grad_id,
          tipoTurnoId: usuario.tipo_turno_id,
          cpf: usuario.cpf || '',
          identidade: usuario.identidade || '',
          validadeIdentidade: usuario.validade_identidade,
          orgaoExpedidor: usuario.orgao_expedidor || '',
          banco: usuario.banco || '',
          agencia: usuario.agencia || '',
          contaBancaria: usuario.conta_bancaria || '',
          dataNascimento: usuario.data_nascimento,
          celular: usuario.celular || '',
          emailEb: usuario.email_eb || ''
        })

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
  }, [refresh])

  const handleForm = async (values, { resetForm }) => {
    try {
      const success = await handleUpdate(
        values.nome,
        values.nomeGuerra,
        values.tipoPostoGradId,
        values.tipoTurnoId,
        values.cpf,
        values.identidade,
        values.validadeIdentidade,
        values.orgaoExpedidor,
        values.banco,
        values.agencia,
        values.contaBancaria,
        values.dataNascimento,
        values.celular,
        values.emailEb
      )
      if (success) {
        setRefresh(new Date())
        setSnackbar({ status: 'success', msg: 'Informações atualizadas com sucesso', date: new Date() })
      }
    } catch (err) {
      setRefresh(new Date())
      handleApiError(err, setSnackbar)
    }
  }

  return (
    <>
      {loaded ? (
        <Container maxWidth='sm'>
          <Paper className={classes.paper}>
            <div className={classes.formArea}>
              <Typography component='h1' variant='h5'>
                Atualizar dados do usuário
              </Typography>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleForm}
              >
                {({ isValid, isSubmitting, isValidating }) => (
                  <Form className={classes.form}>
                    <Field
                      name='nome'
                      component={TextField}
                      variant='outlined'
                      margin='normal'
                      fullWidth
                      label='Nome completo'
                    />
                    <Field
                      name='nomeGuerra'
                      component={TextField}
                      variant='outlined'
                      margin='normal'
                      fullWidth
                      label='Nome de guerra'
                    />
                    <div>
                      <Field
                        name='tipoPostoGradId'
                        label='Posto/Graduação'
                        variant='outlined'
                        component={Select}
                        displayEmpty
                        className={classes.select}
                      >
                        <MenuItem value='' disabled>
                          Selecione seu Posto/Graduação
                        </MenuItem>
                        {listaPostoGrad.map(option => (
                          <MenuItem key={option.code} value={option.code}>
                            {option.nome}
                          </MenuItem>
                        ))}
                      </Field>
                    </div>
                    <div>
                      <Field
                        name='tipoTurnoId'
                        label='Turno'
                        variant='outlined'
                        component={Select}
                        displayEmpty
                        className={classes.select}
                      >
                        <MenuItem value='' disabled>
                          Selecione seu turno de trabalho
                        </MenuItem>
                        {listaTurnos.map(option => (
                          <MenuItem key={option.code} value={option.code}>
                            {option.nome}
                          </MenuItem>
                        ))}
                      </Field>
                    </div>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptLocale}>
                      <Field
                        name='dataNascimento'
                        component={DatePicker}
                        inputVariant='outlined'
                        margin='normal'
                        fullWidth
                        label='Data de nascimento'
                        format='dd/MM/yyyy'
                        autoOk
                        clearable
                        disableFuture
                      />
                    </MuiPickersUtilsProvider>
                    <Field
                      name='celular'
                      component={TextField}
                      variant='outlined'
                      margin='normal'
                      fullWidth
                      label='Celular'
                    />
                    <Field
                      name='emailEb'
                      component={TextField}
                      variant='outlined'
                      margin='normal'
                      fullWidth
                      label='Email (EB)'
                    />
                    <Field
                      name='cpf'
                      component={TextField}
                      variant='outlined'
                      margin='normal'
                      fullWidth
                      label='CPF'
                    />
                    <Field
                      name='identidade'
                      component={TextField}
                      variant='outlined'
                      margin='normal'
                      fullWidth
                      label='Identidade'
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptLocale}>
                      <Field
                        name='validadeIdentidade'
                        component={DatePicker}
                        inputVariant='outlined'
                        margin='normal'
                        fullWidth
                        label='Data de validade da identidade'
                        format='dd/MM/yyyy'
                        autoOk
                        clearable
                        disableFuture
                      />
                    </MuiPickersUtilsProvider>
                    <Field
                      name='orgaoExpedidor'
                      component={TextField}
                      variant='outlined'
                      margin='normal'
                      fullWidth
                      label='Órgão Expedidor'
                    />
                    <Field
                      name='banco'
                      component={TextField}
                      variant='outlined'
                      margin='normal'
                      fullWidth
                      label='Banco'
                    />
                    <Field
                      name='agencia'
                      component={TextField}
                      variant='outlined'
                      margin='normal'
                      fullWidth
                      label='Agência'
                    />
                    <Field
                      name='contaBancaria'
                      component={TextField}
                      variant='outlined'
                      margin='normal'
                      fullWidth
                      label='Conta bancária'
                    />
                    <SubmitButton
                      type='submit' disabled={isValidating || !isValid} submitting={isSubmitting}
                      fullWidth
                      variant='contained'
                      color='primary'
                      className={classes.submit}
                    >
                      Atualizar dados
                    </SubmitButton>
                  </Form>
                )}
              </Formik>
            </div>
          </Paper>
        </Container>
      )
        : (
          <div className={classes.loading}>
            <ReactLoading type='bars' color='#F83737' height='5%' width='5%' />
          </div>
        )}
      {snackbar ? <MessageSnackBar status={snackbar.status} key={snackbar.date} msg={snackbar.msg} /> : null}
    </>
  )
})
