import Particles from 'react-tsparticles'
import { loadFull } from 'tsparticles'
import { Engine, ISourceOptions } from 'tsparticles-engine'
//----------------------------------------  ----------------------------------------
const options: ISourceOptions = {
	background: {
		color: {
			value: '#f0f2f5',
		},
		image: 'url(background.svg)',
		size: 'auto',
	},
	fpsLimit: 120,
	interactivity: {
		events: {
			onClick: {
				enable: true,
				mode: 'push',
			},
			onHover: {
				enable: true,
				mode: 'attract',
			},
			resize: true,
		},
		modes: {
			push: {
				quantity: 4,
			},
			repulse: {
				distance: 200,
				duration: 0.4,
			},
		},
	},
	particles: {
		color: {
			value: '#bfbfbf',
		},
		links: {
			color: '#bfbfbf',
			distance: 120,
			enable: true,
			opacity: 1,
			width: 1,
		},
		collisions: {
			enable: true,
		},
		move: {
			direction: 'none',
			enable: true,
			outModes: {
				default: 'bounce',
			},
			random: true,
			speed: 3,
			straight: false,
		},
		number: {
			density: {
				enable: true,
				area: 800,
			},
			value: 80,
		},
		opacity: {
			value: 0.5,
		},
		shape: {
			type: 'circle',
		},
		size: {
			value: { min: 1, max: 5 },
		},
	},
	detectRetina: true,
	zLayers: 1,
}
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
	const particlesInit = async (main: Engine) => {
		// you can initialize the tsParticles instance (main) here, adding custom shapes or presets
		// this loads the tsparticles package bundle, it's the easiest method for getting everything ready
		// starting from v2 you can add only the features you need reducing the bundle size
		await loadFull(main)
	}

	console.log('render')

	return (
		<>
			<Particles id='tsparticles' init={particlesInit} options={options} />
		</>
	)
}
