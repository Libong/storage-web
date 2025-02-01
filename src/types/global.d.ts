import Message from '@/components/common/Message.vue'
import { ComponentPublicInstance } from 'vue'

declare global {
    interface Window {
        $message: ComponentPublicInstance<typeof Message>
    }
}

export {} 