// @flow
/* eslint-disable react/prop-types */
import expect from 'expect.js'
import React, {type StatelessFunctionalComponent} from 'react'
import TestRenderer from 'react-test-renderer'
import {stripIndent} from 'common-tags'
import {styled, SheetsRegistry, JssProvider, ThemeProvider} from '.'

const createGenerateId = () => {
  let counter = 0
  return rule => `${rule.key}-${counter++}`
}

describe('React-JSS: styled', () => {
  it('should render static styles', () => {
    const registry = new SheetsRegistry()
    const Div = styled('div')({color: 'red'})
    const renderer = TestRenderer.create(
      <JssProvider registry={registry} generateId={createGenerateId()}>
        <Div />
      </JssProvider>
    )
    expect(registry.toString()).to.be(stripIndent`
      .css-0 {
        color: red;
      }
    `)
    const {className, classes} = renderer.root.findByType('div').props
    expect(className).to.be('css-0')
    expect(classes).to.be(undefined)
  })

  it('should render dynamic values', () => {
    const registry = new SheetsRegistry()
    const Div = styled('div')({
      color: 'red',
      width: props => props.width
    })
    const renderer = TestRenderer.create(
      <JssProvider registry={registry} generateId={createGenerateId()}>
        <Div width={10} />
      </JssProvider>
    )
    expect(registry.toString()).to.be(stripIndent`
      .css-0 {
        color: red;
      }
      .css-0-1 {
        width: 10px;
      }
    `)
    expect(renderer.root.findByType('div').props.className).to.be('css-0 css-0-1')
  })

  it('should render dynamic rules', () => {
    const registry = new SheetsRegistry()
    const Div = styled('div')(props => ({
      color: 'red',
      width: props.width
    }))
    const renderer = TestRenderer.create(
      <JssProvider registry={registry} generateId={createGenerateId()}>
        <Div width={10} />
      </JssProvider>
    )
    expect(registry.toString()).to.be(stripIndent`
      .cssd-0 {}
      .cssd-0-1 {
        color: red;
        width: 10px;
      }
    `)
    expect(renderer.root.findByType('div').props.className).to.be('cssd-0 cssd-0-1')
  })

  it('should accept multiple static style rules', () => {
    const registry = new SheetsRegistry()
    // TODO add a template string case
    const Div = styled('div')({color: 'red'}, {border: '1px solid red'})
    const renderer = TestRenderer.create(
      <JssProvider registry={registry} generateId={createGenerateId()}>
        <Div />
      </JssProvider>
    )
    expect(registry.toString()).to.be(stripIndent`
      .css-0 {
        color: red;
        border: 1px solid red;
      }
    `)
    expect(renderer.root.findByType('div').props.className).to.be('css-0')
  })

  it('should filter empty values instead of rules', () => {
    const registry = new SheetsRegistry()
    const Div = styled('div')('', {color: 'red'}, null, {border: '1px solid red'}, undefined)
    const renderer = TestRenderer.create(
      <JssProvider registry={registry} generateId={createGenerateId()}>
        <Div />
      </JssProvider>
    )
    expect(registry.toString()).to.be(stripIndent`
      .css-0 {
        color: red;
        border: 1px solid red;
      }
    `)
    expect(renderer.root.findByType('div').props.className).to.be('css-0')
  })

  it('should accept multiple dynamic style rules', () => {
    const registry = new SheetsRegistry()
    const Div = styled('div')(props => ({width: props.width}), props => ({height: props.height}))
    const renderer = TestRenderer.create(
      <JssProvider registry={registry} generateId={createGenerateId()}>
        <Div width={10} height={10} />
      </JssProvider>
    )
    expect(registry.toString()).to.be(stripIndent`
      .cssd-0 {}
      .cssd-0-1 {
        width: 10px;
        height: 10px;
      }
    `)
    expect(renderer.root.findByType('div').props.className).to.be('cssd-0 cssd-0-1')
  })

  it('should filter empty values returned from dynamic rules', () => {
    const registry = new SheetsRegistry()
    const Div = styled('div')(() => null, () => '', () => undefined, {color: 'red'})
    const renderer = TestRenderer.create(
      <JssProvider registry={registry} generateId={createGenerateId()}>
        <Div />
      </JssProvider>
    )
    expect(registry.toString()).to.be(stripIndent`
      .css-0 {
        color: red;
      }
      .cssd-1 {}
      .cssd-0-2 {}
    `)
    expect(renderer.root.findByType('div').props.className).to.be('css-0 cssd-1 cssd-0-2')
  })

  it('should accept multiple dynamic and static style rules', () => {
    const registry = new SheetsRegistry()
    const Div = styled('div')(
      {color: 'red'},
      props => ({width: props.width}),
      {border: '1px solid red'},
      props => ({height: props.height})
    )
    const renderer = TestRenderer.create(
      <JssProvider registry={registry} generateId={createGenerateId()}>
        <Div width={10} height={10} />
      </JssProvider>
    )
    expect(registry.toString()).to.be(stripIndent`
      .css-0 {
        color: red;
        border: 1px solid red;
      }
      .cssd-1 {}
      .cssd-0-2 {
        width: 10px;
        height: 10px;
      }
    `)
    expect(renderer.root.findByType('div').props.className).to.be('css-0 cssd-1 cssd-0-2')
  })

  it('should accept template string', () => {})

  it('should merge with user class name', () => {
    const registry = new SheetsRegistry()
    const Div = styled('div')({color: 'red'})
    const renderer = TestRenderer.create(
      <JssProvider registry={registry} generateId={createGenerateId()}>
        <Div className="my-class" />
      </JssProvider>
    )
    expect(registry.toString()).to.be(stripIndent`
      .css-0 {
        color: red;
      }
    `)
    expect(renderer.root.findByType('div').props.className).to.be('my-class css-0')
  })

  it('should use "as" prop', () => {
    const registry = new SheetsRegistry()
    const Div = styled('div')({color: 'red'})
    const renderer = TestRenderer.create(
      <JssProvider registry={registry} generateId={createGenerateId()}>
        <Div as="button">
          <span />
        </Div>
      </JssProvider>
    )
    expect(registry.toString()).to.be(stripIndent`
      .css-0 {
        color: red;
      }
    `)
    const {className, as} = renderer.root.findByType('button').props
    expect(className).to.be('css-0')
    expect(as).to.be(undefined)
  })

  it('should not leak non-dom attrs', () => {
    const registry = new SheetsRegistry()
    const Div = styled('div')({
      color: 'red',
      width: props => props.s
    })
    const renderer = TestRenderer.create(
      <JssProvider registry={registry} generateId={createGenerateId()}>
        <Div s={10} />
      </JssProvider>
    )
    expect(registry.toString()).to.be(stripIndent`
      .css-0 {
        color: red;
      }
      .css-0-1 {
        width: 10px;
      }
    `)
    const {className, s} = renderer.root.findByType('div').props
    expect(className).to.be('css-0 css-0-1')
    expect(s).to.be(undefined)
  })

  it('should compose with styled component', () => {
    const registry = new SheetsRegistry()
    const BaseDiv = styled('div')({color: 'red'})
    const Div = styled(BaseDiv)({width: 10})
    const renderer = TestRenderer.create(
      <JssProvider registry={registry} generateId={createGenerateId()}>
        <Div />
      </JssProvider>
    )
    expect(registry.toString()).to.be(stripIndent`
      .css-1 {
        color: red;
      }
      .css-0 {
        width: 10px;
      }
    `)
    const {className} = renderer.root.findByType('div').props
    expect(className).to.be('css-0 css-1')
  })

  it('should pass className to a user component', () => {
    const registry = new SheetsRegistry()
    type Props = Object
    const BaseDiv: StatelessFunctionalComponent<Props> = ({className}: Props) => (
      <div className={className} />
    )
    const Div = styled(BaseDiv)({width: 10})
    const renderer = TestRenderer.create(
      <JssProvider registry={registry} generateId={createGenerateId()}>
        <Div />
      </JssProvider>
    )
    expect(registry.toString()).to.be(stripIndent`
      .css-0 {
        width: 10px;
      }
    `)
    const {className} = renderer.root.findByType('div').props
    expect(className).to.be('css-0')
  })

  it("should pass custom props to a user component if shouldForwardProp doesn't return false", () => {
    type Props = Object
    let receivedProps = {}
    const UserComponent: StatelessFunctionalComponent<Props> = (props: Props) => {
      receivedProps = props
      return <div />
    }
    const shouldForwardProp = prop => prop !== 'disalowed'
    const Div = styled(UserComponent, {shouldForwardProp})({width: 10})
    TestRenderer.create(<Div allowed disalowed />)
    expect(receivedProps.allowed).to.be(true)
    expect(receivedProps.disalowed).to.be(undefined)
  })

  it.skip('should target another styled component (not sure if we really need this)', () => {
    const registry = new SheetsRegistry()
    const Span = styled('span')({color: 'red'})
    const Div = styled('div')({
      // $FlowFixMe
      [Span]: {
        color: 'green'
      }
    })

    const renderer = TestRenderer.create(
      <JssProvider registry={registry} generateId={createGenerateId()}>
        <Div />
      </JssProvider>
    )
    expect(registry.toString()).to.be(stripIndent`
      .css-0 {
        width: 10px;
      }
    `)
    expect(renderer.root.findByType('div').props.className).to.be('XXX')
    expect(renderer.root.findByType('span').props.className).to.be('XXX')
  })

  it('should render theme', () => {
    const registry = new SheetsRegistry()
    const Div = styled('div')({
      color: 'red',
      margin: props => props.theme.spacing
    })
    TestRenderer.create(
      <JssProvider registry={registry} generateId={createGenerateId()}>
        <ThemeProvider theme={({spacing: 10}: Object)}>
          <Div />
        </ThemeProvider>
      </JssProvider>
    )
    expect(registry.toString()).to.be(stripIndent`
      .css-0 {
        color: red;
      }
      .css-0-1 {
        margin: 10px;
      }
    `)
  })

  it('should render label', () => {
    const registry = new SheetsRegistry()
    const Div = styled('div')({label: 'my-div', color: 'red'})
    const renderer = TestRenderer.create(
      <JssProvider registry={registry} generateId={createGenerateId()}>
        <Div />
      </JssProvider>
    )
    expect(registry.toString()).to.be(stripIndent`
        .my-div-0 {
          color: red;
        }
      `)
    const {className} = renderer.root.findByType('div').props
    expect(className).to.be('my-div-0')
  })

  it('should merge labels', () => {
    const registry = new SheetsRegistry()
    const Div = styled('div')(
      {label: 'labela', color: 'red'},
      {label: 'labelb', background: 'red'},
      {label: 'labela', float: 'left'}
    )
    const renderer = TestRenderer.create(
      <JssProvider registry={registry} generateId={createGenerateId()}>
        <Div />
      </JssProvider>
    )
    expect(registry.toString()).to.be(stripIndent`
        .labela-labelb-0 {
          color: red;
          float: left;
          background: red;
        }
      `)
    const {className} = renderer.root.findByType('div').props
    expect(className).to.be('labela-labelb-0')
  })
})