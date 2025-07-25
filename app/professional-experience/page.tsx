'use client';

import {
  IconBriefcase,
  IconBuilding,
  IconCalendar,
  IconExternalLink,
  IconMapPin,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Card,
  Container,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Timeline,
  Title,
} from '@mantine/core';

const experiences = [
  {
    id: 1,
    title: 'Staff Software Engineer',
    company: 'Tesla Inc.',
    location: 'Palo Alto, CA',
    duration: 'June 2024 - Present',
    type: 'Full-time',
    description:
      'Managed a team of 6 Software, Data, and Machine Learning Engineers responsible for building and maintaining various tools and platforms that support the Process, Quality, and Training functions of the Residential Energy Business',
    achievements: [
      'Designed, built, and deployed a self-service machine learning application for free-text classification. This system automated classification from user-defined and labeled datasets, integrating with real-time and batch sources for prediction serving, and offering continuous model retraining and prediction visualization to convert thousands of weekly unstructured data points into actionable feedback for the business.',
      'Designed, architected, and developed a Three.js-powered Balance of System (BOS) design application for residential solar and battery systems. This interactive tool leveraged site survey photos for automated wall and obstruction dimensioning, enabling rapid design with built-in compliance checks against all relevant regulatory constraints. Its implementation significantly reduced permit rejections and customer redesigns, while establishing a robust data foundation for future AI-driven design automation.',
      'Drove continuous improvement and evolution of critical batch and real-time process automations, contributing to over 20% reduction in cycle times over the last 24 months while optimizing customer progression and maximizing revenue across the full business lifecycle (from order to system activation).',
    ],
    technologies: ['Python', 'TypeScript', 'Go', 'Docker', 'Kubernetes', 'SQL', 'NoSQL'],
    website: 'https://www.tesla.com/',
  },
  {
    id: 2,
    title: 'Senior Software Engineer',
    company: 'Tesla Inc.',
    location: 'San Jose, CA',
    duration: 'July 2022 - June 2024',
    type: 'Full-time',
    description:
      'Led a team of 3 engineers in the end-to-end development and maintenance of critical tools and platforms, directly supporting Quality and Training functions within the Residential Energy Business.',
    achievements: [
      'Engineered and deployed a real-time image processing and AI platform, which has processed over 130,000 images to date. This platform automates image quality and content validation using user-defined rules, empowering the business to rapidly build and deploy custom, fine-tuned VGG16 classification models from user-labeled datasets, complete with feedback-driven retraining and automated outputs (e.g., email notifications, ticketing).',
      'Designed and implemented a scalable, dynamic FastAPI-based data collection and testing suite in Python, significantly improving quality control across all residential energy systems. This suite incorporates over a dozen diverse tests, ranging from bill of material alignment to performance-based stringing validation, and proactively identifies discrepancies in approximately 6% of all installations before completion, leading to substantial cost savings and reduced rework.',
    ],
    technologies: ['Python', 'TypeScript', 'Docker', 'Kubernetes', 'SQL'],
    website: 'https://www.tesla.com/',
  },
  {
    id: 3,
    title: 'Data Engineer',
    company: 'Tesla Inc.',
    location: 'San Jose, CA',
    duration: 'Dec 2021 - July 2022',
    type: 'Full-time',
    description:
      'Built critical data and automation pipelines across various internal platforms for the Residential Energy Business.',
    achievements: [
      'Engineered and maintained 15+ scalable ETL pipelines using Python, Pandas, PySpark, and Airflow to deliver critical insights and support core business metrics',
      'Developed and optimized SQL Server views, stored procedures, and triggers to effectively manage and integrate legacy data tables and pipelines.',
      'Implemented comprehensive alerting systems for proactive monitoring of installation quality issues.',
    ],
    technologies: ['Python', 'Airflow', 'SQL', 'Docker', 'Kubernetes'],
    website: 'https://www.tesla.com/',
  },
  {
    id: 4,
    title: 'Associate Data Scientist',
    company: 'Tesla Inc.',
    location: 'Reno, NV',
    duration: 'Jan 2020 - Dec 2021',
    type: 'Full-time',
    description:
      'Supported critical quality initiatives for Megapack and Model 3 Drive Unit Production leveraging data and statistics.',
    achievements: [
      'Designed and implemented business-critical quality metrics, leveraging custom ETL pipelines built with Airflow for data processing and Tableau dashboards for visualization, directly driving significant quality enhancements within the factory environment.',
      'Conducted advanced statistical analyses to support quality engineers, driving improvements in Model 3 Drive Unit and Megapack production.',
      'Engineered serverless alerting and monitoring systems, leveraging real-time Kafka data, to notify operations teams of critical factory issues.',
    ],
    technologies: ['Python', 'Airflow', 'SQL', 'Tableau', 'Docker', 'Kubernetes'],
    website: 'https://www.tesla.com/',
  },
];

export default function ProfessionalExperiencePage() {
  return (
    <Container size="lg" py="xl">
      {/* Header Section */}
      <Stack gap="xl" mb="xl">
        <div>
          <Title order={1} mb="md">
            Professional Experience
          </Title>
          <Text size="lg" c="dimmed">
            A journey through my career in software, data, and machine learning
          </Text>
        </div>
      </Stack>

      {/* Timeline View */}
      <Timeline active={experiences.length} bulletSize={40} lineWidth={2}>
        {experiences.map((experience) => (
          <Timeline.Item
            key={experience.id}
            bullet={
              <ThemeIcon size={40} variant="gradient" radius="xl">
                <IconBriefcase size={20} />
              </ThemeIcon>
            }
            title={
              <Group justify="space-between" align="flex-start" wrap="nowrap">
                <div>
                  <Title order={3} mb={4}>
                    {experience.title}
                  </Title>
                  <Group gap="xs" mb="xs">
                    <IconBuilding size={16} />
                    <Text fw={500} c="blue">
                      {experience.company}
                    </Text>
                    {experience.website && (
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        component="a"
                        href={experience.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconExternalLink size={14} />
                      </ActionIcon>
                    )}
                  </Group>
                </div>
                <Badge variant="light" size="sm">
                  {experience.type}
                </Badge>
              </Group>
            }
          >
            <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
              {/* Duration and Location */}
              <Group mb="md" gap="xl">
                <Group gap="xs">
                  <IconCalendar size={16} />
                  <Text size="sm" c="dimmed">
                    {experience.duration}
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconMapPin size={16} />
                  <Text size="sm" c="dimmed">
                    {experience.location}
                  </Text>
                </Group>
              </Group>

              <Text mb="md" size="sm">
                {experience.description}
              </Text>

              {/* Key Achievements */}
              <div>
                <Text fw={500} mb="xs" size="sm">
                  Key Achievements:
                </Text>
                <Stack gap="xs" mb="md">
                  {experience.achievements.map((achievement, idx) => (
                    <Text key={idx} size="sm" pl="md" style={{ position: 'relative' }}>
                      <span
                        style={{
                          position: 'absolute',
                          left: '4px',
                          color: 'var(--mantine-color-blue-6)',
                        }}
                      >
                        •
                      </span>
                      {achievement}
                    </Text>
                  ))}
                </Stack>
              </div>

              {/* Technologies */}
              <div>
                <Text fw={500} mb="xs" size="sm">
                  Technologies:
                </Text>
                <Group gap="xs">
                  {experience.technologies.map((tech) => (
                    <Badge key={tech} variant="dot" size="sm">
                      {tech}
                    </Badge>
                  ))}
                </Group>
              </div>
            </Card>
          </Timeline.Item>
        ))}
      </Timeline>
    </Container>
  );
}
