import React from 'react';

interface Props {
  promise: Promise<unknown>;
}

export class PromiseComponent extends React.Component<Props> {
  state = {
    component: <div>Loading...</div>,
  };

  static Then = (props: React.ComponentPropsWithoutRef<any>) => props.children;
  static Catch = (props: React.ComponentPropsWithoutRef<any>) => props.children;

  getThen(clazz: React.ComponentType) {
    if (!this.props.children || this.props.children === true) return null;

    return React.Children.toArray(this.props.children)
      .filter(elem => (elem as React.ReactElement).type === clazz)
      .map(elem => React.Children.toArray(elem))
      .pop()
  }

  componentDidMount() {
    this.props.promise
      .then(() => {
        const component = this.getThen(PromiseComponent.Then);

        this.setState({ component });
      })
      .catch(() => {
        const component = this.getThen(PromiseComponent.Catch);

        this.setState({ component });
      });
  }

  render() {
    return this.state.component || null;
  }
}
