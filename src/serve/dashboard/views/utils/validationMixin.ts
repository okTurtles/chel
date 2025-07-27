import { debounce } from '../../common/cdLodash.ts'
import { validationMixin as vuelidateSetup } from '../../../../deps.ts'

// TypeScript interfaces for Vue component with vuelidate
interface VuelidateField {
  $reset(): void
  $touch(): void
  $error: boolean
}

interface VuelidateForm {
  [key: string]: VuelidateField
}

interface ValidationMixinContext {
  $v: {
    form: VuelidateForm
  }
  form: { [key: string]: any }
  debounceValidation(fieldName: string, value: any): void
  updateField(fieldName: string, value: any): void
}

/**
Methods to debounce vuelidate validations.

Ex.

// Using v-model

input.input(
  :class='{ "error": $v.form.email.$error }'
  type='email'
  v-model='form.email'
  @input='debounceField("email")'
  @blur='updateField("email")'
  v-error:email=''
)

// without v-model
input.input(
  :class='{ "error": $v.form.name.$error }'
  name='username'
  @input='e => debounceField("username", e.target.value)'
  @blur='e => updateField("username", e.target.value)'
  v-error:username=''
)

// -- Debounce both validation and $error feedback (cannot use v-model)
input.input(
  :class='{error: $v.form.name.$error}'
  name='username'
  @input='e => debounceValidation("username", e.target.value)'
  @blur='e => updateField("username", e.target.value)'
  v-error:username=''
)
*/

export default {
  mixins: [vuelidateSetup],
  methods: {
    debounceField (this: ValidationMixinContext, fieldName: string, value: any) {
      // Do a field validation, but don't show $error immediately
      this.$v.form[fieldName].$reset()
      // Wait a little to make sure the user stopped typing..
      this.debounceValidation(fieldName, value)
    },

    /**
     * Validate the field and update it immediately.
     * - Usually used on @blur.
     */
    updateField (this: ValidationMixinContext, fieldName: string, value: any) {
      if (value) {
        // it means it needs to be manually binded
        this.form[fieldName] = value
      }
      this.$v.form[fieldName].$touch()
    },

    /**
     * Debounce field validations
     * - You can call it when you want to debounce expensive validations.
     */
    debounceValidation: debounce(function (this: ValidationMixinContext, fieldName: string, value: any) {
      this.updateField(fieldName, value)
    }, 800, false),

    // sometimes, validations for all fields need to be done all at once.
    // e.g) validate all fields at the same time when 'submit' is clicked.
    validateAll (this: ValidationMixinContext) {
      const validationKeys = Object.keys(this.form || {})
        .filter(key => Boolean(this.$v.form[key]))

      for (const key of validationKeys) {
        this.$v.form[key].$touch()
      }
    }
  }
}
