/* eslint-env mocha */
const fs = require('fs')
const request = require('./request')
const todos = require('./app/features/todos')
const users = require('./app/features/users')

describe('buhoi arg parsing', function () {
  beforeEach(() => {
    todos.publicProcedureSpy.resetHistory()
  })

  it('should treat no content as empty arg array', async function () {
    const { status } = await request({
      url: 'https://localhost:3001/rpc/todos.publicProcedure',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      timeout: 1000,
      validateStatus: () => true,
    })
    todos.publicProcedureSpy.calledOnce.should.eql(true)
    todos.publicProcedureSpy.lastCall.args.slice(0, -2).should.eql([])
    status.should.eql(200)
  })

  it('should treat no args in params as empty arg array', async function () {
    const { status } = await request({
      url: 'https://localhost:3001/rpc/todos.publicProcedure',
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
      timeout: 1000,
      validateStatus: () => true,
    })
    todos.publicProcedureSpy.calledOnce.should.eql(true)
    todos.publicProcedureSpy.lastCall.args.slice(0, -2).should.eql([])
    status.should.eql(200)
  })

  it('should respond with 500 if args are invalid JSON', async function () {
    const { status } = await request({
      url: 'https://localhost:3001/rpc/todos.publicProcedure',
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
      params: { args: 'arg' },
      timeout: 1000,
      validateStatus: () => true,
    })
    status.should.eql(500)
  })

  it('should respond with 500 if body does not contains array of args', async function () {
    const { status } = await request({
      url: 'https://localhost:3001/rpc/todos.publicProcedure',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: 'dolphin',
      timeout: 1000,
      validateStatus: () => true,
    })
    status.should.eql(500)
  })

  it('should receive forms with files', async function () {
    const form = new FormData()
    form.append('user_id', 10)
    form.append('avatar', new Blob(await fs.createReadStream(`${__dirname}/app/public/index.html`).toArray()))

    const { status } = await request({
      url: 'https://localhost:3001/rpc/users.uploadAvatar',
      method: 'post',
      data: form,
      timeout: 1000,
      validateStatus: () => true,
    })
    status.should.eql(200)
    users.uploadAvatarSpy.calledOnce.should.eql(true)
    const args = users.uploadAvatarSpy.lastCall.args
    args[0].should.have.property('user_id')
    args[0].user_id.should.eql('10')
    args[0].should.have.property('avatar')
    args[0].avatar.buffer.should.eql(Buffer.from('myindex'))
  })
})
