gluestack-ui Mobile App Development Guide for AI (Detailed Version)
This document is the primary guide for Artificial Intelligence (AI) agents developing mobile applications with React Native (Expo) using the gluestack-ui library. Strict adherence to the steps and rules in this document is mandatory to produce error-free, consistent, and high-quality code. This version includes specific instructions for migrating the existing BabyTrackerApp project to the gluestack-ui ecosystem.

1. Project Setup and Configuration
Step 1.1: Create a New Expo Project
Always start a new project using the latest version of create-expo-app.

npx create-expo-app@latest ProjectName
cd ProjectName

Step 1.2: Integrate gluestack-ui into the Project
The gluestack-ui installation must only be done using the following init command.

npx gluestack-ui init

Step 1.3: Wrap the Main App Component (Provider Setup)
This step is critical. In the application's entry point, App.tsx, the entire application must be wrapped with GluestackUIProvider.

// App.tsx
import React from 'react';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from './gluestack-ui.config';
import Navigation from './src/navigation'; // The React Navigation structure

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <Navigation />
    </GluestackUIProvider>
  );
}

2. Core Components and Usage Examples
Rule 2.1: Adding Components
Before using a component, it is mandatory to add it to the project using the npx gluestack-ui add <component-name> command.

Rule 2.2: Importing Components
Components must always be imported via the alias created by gluestack-ui, which is typically @/components/ui.

ABSOLUTELY CORRECT: import { Box } from '@/components/ui/box';

STRICTLY INCORRECT: import { Box } from '@gluestack-ui/themed';

Practical Examples for Frequently Used Components
Box: The most fundamental building block. It's an enhanced version of the View component.

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
// Example: Creating a card
<Box bg="$primary500" p="$4" borderRadius="$lg" shadow="$md">
  <Text color="$white">This is a Box component.</Text>
</Box>

VStack & HStack: Used for vertical (VStack) and horizontal (HStack) layouts. They simplify styling properties like flexDirection, alignItems, and justifyContent.

import { VStack, HStack } from '@/components/ui/stacks';
import { Box } from '@/components/ui/box';
// Example: Horizontal and vertical layout
<VStack space="md" p="$2">
  <Text>Vertical List</Text>
  <HStack space="md">
    <Box w={50} h={50} bg="$red400" />
    <Box w={50} h={50} bg="$green400" />
    <Box w={50} h={50} bg="$blue400" />
  </HStack>
</VStack>

Heading & Text: Used for text content. Heading is for titles, and Text is for regular text. Their sizes can be easily adjusted with the size prop.

import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
<VStack>
  <Heading size="xl">Main Title</Heading>
  <Text size="md">This is a paragraph of text.</Text>
</VStack>

Pressable: Used to create tappable areas. It's the foundation of the Button component.

import { Pressable } from '@/components/ui/pressable';
// Example: A custom pressable card
<Pressable p="$5" bg="$backgroundLight200" borderRadius="$xl" onPress={() => console.log('Pressed!')}>
  <Text>Press Me</Text>
</Pressable>

3. Styling and Theming
Rule 3.1: Styling Method
To style components, only use the "utility props" provided by gluestack-ui (e.g., bg, p, m, borderRadius).

Rule 3.2: Theme Customization
To change global styles like theme colors, spacing, or font sizes, only edit the tokens object in the gluestack-ui.config.ts file.

4. Debugging Protocol
Styles Not Appearing / Appearing Incorrectly?

Check the GluestackUIProvider setup.

Clear the Metro bundler cache and restart: npx expo start -c.

"Component not found" Error?

Ensure you have run npx gluestack-ui add <component-name>.

Prop/Variant Error?

Check the official gluestack-ui documentation to verify the prop's validity for that component.

5. Migrating the Existing Project (BabyTrackerApp Example)
This section explains how to rebuild existing libraries and components from the BabyTrackerApp project with their gluestack-ui equivalents.

5.1 Navigation (React Navigation)
gluestack-ui is a UI library and does not replace React Navigation. They work together. Navigation components like Bottom Tabs can be styled using gluestack-ui components for icons and labels.

Example: Creating a Bottom Tab Icon with gluestack-ui

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@/components/ui/icon'; // gluestack Icon
import { HomeIcon } from 'lucide-react-native'; // Icon from lucide-react-native

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: config.tokens.colors.primary500, // Using color from the theme
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon as={HomeIcon} color={color} size="xl" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

5.2 Replacing Custom UI Libraries
@react-native-community/datetimepicker -> Modal + Button
Displaying the date picker inside a gluestack-ui Modal provides a consistent user experience.

import { Button, ButtonText } from '@/components/ui/button';
import { Modal, ModalBackdrop, ModalContent, ModalBody } from '@/components/ui/modal';
// ...
const [showPicker, setShowPicker] = React.useState(false);
<Button onPress={() => setShowPicker(true)}>
  <ButtonText>Select Date</ButtonText>
</Button>
<Modal isOpen={showPicker} onClose={() => setShowPicker(false)}>
  <ModalBackdrop />
  <ModalContent>
    <ModalBody>
      {/* DateTimePicker component goes here */}
      <DateTimePicker value={new Date()} mode="date" display="inline" />
    </ModalBody>
  </ModalContent>
</Modal>

react-native-svg -> Icon Component
The gluestack-ui Icon component already uses react-native-svg and works perfectly with libraries like lucide-react-native.

import { Icon } from '@/components/ui/icon';
import { BabyIcon } from 'lucide-react-native';
<Icon as={BabyIcon} size="xl" color="$primary500" />

react-native-linear-gradient -> Integrated Box Styling
gluestack-ui provides this functionality through its styling system on the Box component.

import { Box } from '@/components/ui/box';
// If gradient is defined in the config:
<Box sx={{_light: { bg: 'linear-gradient(to bottom, $primary500, $primary700)' } }} p="$4">
    <Text>Gradient Background</Text>
</Box>

5.3 Rebuilding In-Project Custom Components
BabyCard -> Box, HStack, VStack, Heading, Text

import { Box, HStack, VStack, Heading, Text, Pressable, Image } from '@/components/ui';
const BabyCard = ({ baby, onPress }) => (
  <Pressable onPress={onPress}>
    <Box p="$4" borderRadius="$xl" bg="$backgroundLight100" shadow="$sm">
      <HStack space="md" alignItems="center">
        <Image source={{ uri: baby.photoUrl }} alt={baby.name} size="md" borderRadius="$full" />
        <VStack>
          <Heading size="lg">{baby.name}</Heading>
          <Text size="sm">{baby.age}</Text>
        </VStack>
        {/* MetricDisplayButton components go here */}
      </HStack>
    </Box>
  </Pressable>
);

AddBabyCard -> Pressable, Icon

import { Pressable, VStack, Icon, Text } from '@/components/ui';
import { PlusCircleIcon } from 'lucide-react-native';
const AddBabyCard = ({ onPress }) => (
  <Pressable onPress={onPress} p="$4" borderRadius="$xl" borderWidth={2} borderColor="$primary300" borderStyle="dashed">
    <VStack space="md" alignItems="center" justifyContent="center">
      <Icon as={PlusCircleIcon} size="xl" color="$primary500" />
      <Text color="$primary500">Add Baby</Text>
    </VStack>
  </Pressable>
);

BabySelectorModal -> Modal Component
The gluestack-ui Modal is perfect for this. Its content can be populated with a FlatList and BabyCard-like structures.

MetricDisplayButton -> Pressable, VStack, Text

import { Pressable, VStack, Text } from '@/components/ui';
const MetricDisplayButton = ({ label, value, unit, onPress }) => (
  <Pressable onPress={onPress} bg="$backgroundLight0" p="$2" borderRadius="$lg" alignItems="center">
    <VStack>
      <Text size="xs" color="$textLight500">{label}</Text>
      <Text size="md" fontWeight="$bold">{value} <Text size="sm">{unit}</Text></Text>
    </VStack>
  </Pressable>
);
