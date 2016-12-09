import { expect } from 'chai';
import Inferno from 'inferno';
import Component from 'inferno-component';

const render = Inferno.render;
const linkEvent = Inferno.linkEvent;

describe('linkEvent', () => {
	let container;

	beforeEach(() => {
		container = document.createElement('div');
		document.body.appendChild(container);
	});

	afterEach(() => {
		document.body.removeChild(container);
		container.innerHTML = '';
	});

	describe('linkEvent on a button (onClick)', () => {
		let test;

		function handleOnClick(props) {
			test = props.test;
		}
		function FunctionalComponent(props) {
			return <button onClick={ linkEvent(props, handleOnClick) } />;
		}

		class StatefulComponent extends Component<any, any> {
			render() {
				return <button onClick={ linkEvent(this.props, handleOnClick) } />;
			}
		}

		it('should work correctly for functional components', () => {
			render(<FunctionalComponent test="123"/>, container);
			container.querySelector('button').click();
			expect(test).to.equal('123');
		});

		it('should work correctly for stateful components', () => {
			render(<StatefulComponent test="456"/>, container);
			container.querySelector('button').click();
			expect(test).to.equal('456');
		});
	});

	describe('linkEvent on a input (onInput)', () => {
		let test;
		let event;

		function simulateInput(elm, text) {
			if (typeof Event !== 'undefined') {
				elm.dispatchEvent(new Event('input'));
			} else {
				elm.oninput({
					target: elm
				});
			}
		}

		function handleOnInput(props, e) {
			test = props.test;
			event = e;
		}
		function FunctionalComponent(props) {
			return <input type="text" onInput={ linkEvent(props, handleOnInput) } value="" />;
		}

		class StatefulComponent extends Component<any, any> {
			render() {
				return <input type="text" onInput={ linkEvent(this.props, handleOnInput) } value="" />;
			}
		}

		it('should work correctly for functional components', () => {
			render(<FunctionalComponent test="123"/>, container);
			simulateInput(container.querySelector('input'), '123')
			expect(test).to.equal('123');
			expect(event.target.nodeName).to.equal('INPUT');
		});

		it('should work correctly for stateful components', () => {
			render(<StatefulComponent test="456"/>, container);
			simulateInput(container.querySelector('input'), '123')
			expect(test).to.equal('456');
			expect(event.target.nodeName).to.equal('INPUT');
		});
	});	
});