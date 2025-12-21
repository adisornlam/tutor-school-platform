<template>
  <component :is="iconComponent" :class="iconClass" />
</template>

<script setup lang="ts">
import {
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  UserIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  CurrencyDollarIcon,
  TagIcon,
  ChartBarIcon,
  CogIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  AcademicCapIcon,
  CalendarIcon,
  MegaphoneIcon,
  ChatBubbleLeftRightIcon,
  NewspaperIcon
} from '@heroicons/vue/24/outline'

// Create aliases after import (ES2015 doesn't support destructuring in import)
const BuildingIcon = BuildingOfficeIcon
const BookIcon = BookOpenIcon
const ClipboardIcon = ClipboardDocumentCheckIcon
const CurrencyIcon = CurrencyDollarIcon
const ChartIcon = ChartBarIcon

interface Props {
  icon?: string | null
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: null,
  class: 'w-5 h-5'
})

const iconMap: Record<string, any> = {
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  UserIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  BuildingIcon: BuildingOfficeIcon,
  BookOpenIcon,
  BookIcon: BookOpenIcon,
  ClipboardDocumentCheckIcon,
  ClipboardIcon: ClipboardDocumentCheckIcon,
  CurrencyDollarIcon,
  CurrencyIcon: CurrencyDollarIcon,
  TagIcon,
  ChartBarIcon,
  ChartIcon: ChartBarIcon,
  CogIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  AcademicCapIcon,
  CalendarIcon,
  MegaphoneIcon,
  ChatBubbleLeftRightIcon,
  NewspaperIcon
}

const iconComponent = computed(() => {
  if (!props.icon) return null
  return iconMap[props.icon] || null
})

const iconClass = computed(() => props.class)
</script>

