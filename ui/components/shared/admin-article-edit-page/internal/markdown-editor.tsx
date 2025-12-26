import type { BytemdPlugin, EditorProps } from 'bytemd'
import breaks from '@bytemd/plugin-breaks'
import gfm from '@bytemd/plugin-gfm'
import gfm_zhHans from '@bytemd/plugin-gfm/lib/locales/zh_Hans.json'
import highlightSsr from '@bytemd/plugin-highlight-ssr'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import { Editor } from '@bytemd/react'
import zh_Hans from 'bytemd/locales/zh_Hans.json'
import { common } from 'lowlight'
import { toast } from 'sonner'
import { genUploader } from 'uploadthing/client'
import 'highlight.js/styles/tokyo-night-dark.css'
import 'bytemd/dist/index.css'

const plugins: BytemdPlugin[] = [
  gfm({ locale: gfm_zhHans }),
  highlightSsr({
    languages: {
      ...common,
    },
  }),
  breaks(),
  mediumZoom(),
]

const handleUploadImages: EditorProps['uploadImages'] = async files => {
  if (files == null || files.length === 0) {
    toast.error('请先选择图片')
    return []
  }

  const { uploadFiles } = genUploader()

  const uploadPromise = uploadFiles('imageUploader', { files })

  const response = await toast.promise(uploadPromise, {
    loading: '图片上传中...',
    success: '图片上传成功',
    error: '图片上传失败',
  })

  return response.unwrap()
}

export default function MarkdownEditor({
  value,
  onChange,
}: {
  value: string
  onChange: () => void
}) {
  return (
    <div id="content-editor">
      <Editor
        value={value}
        onChange={onChange}
        locale={zh_Hans}
        plugins={plugins}
        uploadImages={handleUploadImages}
      />
    </div>
  )
}
