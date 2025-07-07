-- Insert default prompt packs
INSERT INTO public.prompt_packs (name, description, icon, questions) VALUES
(
  'Before Bed',
  'Reflect on your day and prepare for rest',
  '🌙',
  ARRAY[
    'What was the highlight of your day?',
    'What are you grateful for today?',
    'How are you feeling as you wind down?',
    'What would you like to let go of from today?'
  ]
),
(
  'After Work',
  'Transition from work to personal time',
  '💼',
  ARRAY[
    'How did work feel today?',
    'What did you accomplish?',
    'What are you looking forward to now?',
    'How do you want to spend your evening?'
  ]
),
(
  'Moments of Joy',
  'Capture and celebrate positive experiences',
  '✨',
  ARRAY[
    'What made you smile today?',
    'What brought you joy in this moment?',
    'Who or what are you grateful for right now?',
    'What would you like to remember about this feeling?'
  ]
),
(
  'When Anxious',
  'Ground yourself and process difficult feelings',
  '🌱',
  ARRAY[
    'What are you feeling right now?',
    'What thoughts are going through your mind?',
    'What do you need in this moment?',
    'What would help you feel more grounded?'
  ]
);
