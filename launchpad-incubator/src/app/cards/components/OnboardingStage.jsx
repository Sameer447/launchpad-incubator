import { Flex, Text } from '@hubspot/ui-extensions';

/**
 * OnboardingStage Component
 * Displays onboarding progress with a progress bar
 */
const OnboardingStage = ({ stage }) => {
  return (
    <Flex direction="column" gap="xs">
      <Flex justify="between" align="center">
        <Text format={{ fontWeight: 'medium' }}>
          Onboarding Stage
        </Text>
        {/* <Text variant="microcopy">
          {stage.progress}%
        </Text> */}
        <Text variant="microcopy">
        {stage.label}
      </Text>
      </Flex>
      {/* <ProgressBar value={stage.progress} variant={stage.progress === 100 ? 'success' : 'default'} /> */}
      {/* <Text variant="microcopy">
        {stage.label}
      </Text> */}
    </Flex>
  );
};

export default OnboardingStage;