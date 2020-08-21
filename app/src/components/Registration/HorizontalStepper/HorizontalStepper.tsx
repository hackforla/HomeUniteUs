import React from 'react'
import { withStyles, WithStyles } from '@material-ui/core/'
import { styles } from './styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepButton from '@material-ui/core/StepButton'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

//non-linear stepper --> user can step through any part of the flow
//logic kept here so as not to pollute sandbox component

interface Props extends WithStyles<typeof styles> {
    // add props excluding classes
}

function getSteps() {
    return ['Fill out info', 'Tell us about you', 'Preferences']
}

function getStepContent(step: number) {
    switch (step) {
        case 0:
            return 'Step 1: The boring stuff...'
        case 1:
            return 'Step 2: Get to know you?'
        case 2:
            return 'Step 3: This is the bit I really care about!'
        default:
            return 'Unknown step'
    }
}

const HorizontalStepper = (props: Props) => {
    const { classes } = props
    const [activeStep, setActiveStep] = React.useState(0)
    const [completed, setCompleted] = React.useState<{ [k: number]: boolean }>(
        {}
    )
    const steps = getSteps()

    const totalSteps = () => {
        return steps.length
    }

    const completedSteps = () => {
        return Object.keys(completed).length
    }

    const isLastStep = () => {
        return activeStep === totalSteps() - 1
    }

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps()
    }

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed,
                  // find the first step that has been completed
                  steps.findIndex((step, i) => !(i in completed))
                : activeStep + 1
        setActiveStep(newActiveStep)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const handleStep = (step: number) => () => {
        setActiveStep(step)
    }

    const handleComplete = () => {
        const newCompleted = completed
        newCompleted[activeStep] = true
        setCompleted(newCompleted)
        handleNext()
    }

    const handleReset = () => {
        setActiveStep(0)
        setCompleted({})
    }

    return (
        <div className={classes.root}>
            <Stepper nonLinear activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepButton
                            onClick={handleStep(index)}
                            completed={completed[index]}
                        >
                            {label}
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
            <div>
                {allStepsCompleted() ? (
                    <div>
                        <Typography className={classes.instructions}>
                            All steps completed - you&apos;re finished
                        </Typography>
                        <Button onClick={handleReset}>Reset</Button>
                    </div>
                ) : (
                    <div>
                        <Typography className={classes.instructions}>
                            {getStepContent(activeStep)}
                        </Typography>
                        <div>
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                className={classes.button}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNext}
                                className={classes.button}
                            >
                                Next
                            </Button>
                            {activeStep !== steps.length &&
                                (completed[activeStep] ? (
                                    <Typography
                                        variant="caption"
                                        className={classes.completed}
                                    >
                                        Step {activeStep + 1} already completed
                                    </Typography>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleComplete}
                                    >
                                        {completedSteps() === totalSteps() - 1
                                            ? 'Finish'
                                            : 'Complete Step'}
                                    </Button>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default withStyles(styles)(HorizontalStepper)
