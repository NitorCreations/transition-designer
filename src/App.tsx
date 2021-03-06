import {motion} from 'framer-motion'
import './App.scss'
import TransitionPreview from './components/TransitionPreview/TransitionPreview'
import PropertySelector from './components/PropertySelector/PropertySelector'
import {contentVariants} from './animation'
import {useCallback} from 'react'
import ValueSlider from './components/ValueSlider/ValueSlider'
import Footer from './components/Footer/Footer'
import {timingFunctions, transitionProperties} from './data'
import {Transition} from './types'
import TransitionsList from './components/TransitionsList/TransitionsList'
import uniqueId from 'lodash/uniqueId'
import {useTransitionsList, useUnload} from './hooks'
import AddNewTransitionButton from './components/AddNewTransitionButton/AddNewTransitionButton'
import BezierEditor from './components/BezierEditor/BezierEditor'
import HelpText from './components/HelpText/HelpText'
import {GA4React} from 'ga-4-react'

const defaultTransition: Transition = {
  property: transitionProperties[0],
  timingFunction: timingFunctions[0],
  duration: 300,
  delay: 0,
  id: uniqueId()
}

const App = ({ga}: {ga?: GA4React}) => {
  const {
    transitions,
    selectedTransition,
    setTransitions,
    setSelectedTransition,
    setSelectedProperty,
    setSelectedTimingFunction,
    setSelectedDuration,
    setSelectedDelay
  } = useTransitionsList(defaultTransition)

  useUnload(e => {
    e.preventDefault()
  })

  const selectedProperties = transitions.map(({property}) => property.name)
  const filteredProperties = transitionProperties.filter(
    property => !selectedProperties.includes(property.name)
  )

  const addNewTransition = useCallback(() => {
    setSelectedProperty(filteredProperties[0])
    const newTransition: Transition = {
      property: filteredProperties[0],
      duration: defaultTransition.duration,
      timingFunction: defaultTransition.timingFunction,
      delay: defaultTransition.delay,
      id: uniqueId()
    }

    setTransitions(currentState => [...currentState, newTransition])
    setSelectedTransition(newTransition)
    ga?.event('user_engagement', 'add new property', 'engagement')
  }, [
    filteredProperties,
    ga,
    setSelectedProperty,
    setSelectedTransition,
    setTransitions
  ])

  const deleteTransition = useCallback(
    transition => {
      setTransitions(currentState =>
        currentState.filter(({id}) => id !== transition.id)
      )
    },
    [setTransitions]
  )

  const resetTransition = useCallback(() => {
    setTransitions([defaultTransition])
    setSelectedTransition(defaultTransition)
  }, [setSelectedTransition, setTransitions])

  return (
    <div className="app">
      <div className="header-block">
        <motion.h1
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 1}}
        >
          Transition Designer
        </motion.h1>

        <HelpText />
      </div>

      <span className="mobile-error-message">
        I'm sorry my dude, but the app really won't work on a screen this small
      </span>

      <div className="main">
        <TransitionsList
          transitions={transitions}
          selectedTransition={selectedTransition}
          setSelectedTransition={setSelectedTransition}
          deleteTransition={deleteTransition}
          resetTransition={resetTransition}
        />
        <div className="content-container">
          <motion.div
            className="content"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="selectors"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{duration: 1.5}}
            >
              <PropertySelector
                properties={filteredProperties}
                setSelectedProperty={setSelectedProperty}
                text="Select property"
                selectedProperty={selectedTransition.property}
              />
              <PropertySelector
                properties={timingFunctions}
                setSelectedProperty={setSelectedTimingFunction}
                text="Select timing function"
                selectedProperty={selectedTransition.timingFunction}
              />

              {selectedTransition.timingFunction.name === 'custom' && (
                <BezierEditor
                  selectedValue={
                    selectedTransition.timingFunction.value as string
                  }
                  setSelectedTimingFunction={setSelectedTimingFunction}
                />
              )}

              <ValueSlider
                selectedValue={selectedTransition.duration}
                minValue={100}
                setValue={setSelectedDuration}
                text="Select duration"
              />
              <ValueSlider
                selectedValue={selectedTransition.delay}
                setValue={setSelectedDelay}
                text="Select delay"
              />

              <AddNewTransitionButton
                addNewTransition={addNewTransition}
                disabled={!filteredProperties.length}
              />
            </motion.div>

            <TransitionPreview
              transitionProperties={selectedProperties}
              transitions={transitions}
              ga={ga}
            />
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default App
