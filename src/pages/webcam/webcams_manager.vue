<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card style="width: 500px; max-width: 95vw;">
      <q-card-section class="q-pa-none">
        <div class="row panel-primary q-px-md q-py-sm items-center q-gutter-md">

          <div class="col">
            <div class="text-h6">Capturer une photo</div>
          </div>
          <div class="col-auto">
            <q-btn
              :disable="loading"
              color="blue-1"
              text-color="primary"
              icon="close"
              round
              size="sm"
              v-close-popup
              unelevated
              @click="$emit('onclose',true)"
            />
          </div>
        </div>
        <linearLoading :loading="loading" />
        <q-separator />

        <div
          class="row  q-py-sm scroll "
          style="max-height:75vh"
        >
          <div class="col">
            <q-form ref="myForm">
              <div class="row q-col-gutter-md ">
                <div class="col">
                  <div
                    class="contStylephoto relative-position"
                    style="width:360px;height:280px;overflow:hidden"
                  >
                    <video
                      v-if="this.captureImage == null"
                      style="width:100%;height:100%"
                      id="video"
                      autoplay
                    ></video>
                    <q-img
                      v-else
                      :src="this.captureImage"
                      spinner-color="white"
                      spinner-size="35px"
                      class="stylePhoto bg-blue-1"
                      style="height :270px;width :350px;"
                    />
                  </div>
                </div>
              </div>
              <div class="row justify-center q-mb-md">
                <div class="col-auto">
                  <div style="width:360px">
                    <q-select
                      :disable="captureImage != null"
                      v-if="browserSupport && !!cameras && cameras.length > 1"
                      transition-show="scale"
                      transition-hide="scale"
                      square
                      outlined
                      dense
                      placeholder="Site minier"
                      fill-input
                      hide-selected
                      hide-bottom-space
                      use-input
                      emit-value
                      map-options
                      v-model="selectedCamera"
                      :options="cameras"
                      :option-value="opt => opt"
                      :option-label="opt => `${opt.label}`"
                      @input="onChangeCamera"
                    />
                  </div>
                </div>
              </div>
              <q-separator />
              <div class="row justify-center items-center q-my-md ">
                <div class="col-auto q-pr-md">
                  <q-btn
                    v-if="browserSupport"
                    :disable="!(!!selectedCamera) || !(!!webcamStream)"
                    :color="`${captureImage == null?'primary':'warning'}`"
                    text-color="white"
                    :label="`${captureImage == null ? 'Capturer':'Annuler'}`"
                    :icon-right="`${captureImage == null ? 'las la-camera':'las la-times'}`"
                    size="12px"
                    rounded
                    unelevated
                    @click="captureImage == null
                    ? getCaptureImage()
                    : startWebcam(selectedCamera.deviceId)"
                  />
                </div>
                <div class="col-auto">
                  <q-btn
                    v-if="browserSupport"
                    :disable="!(!!captureImage)"
                    color="primary"
                    text-color="white"
                    label="Valider"
                    icon-right="las la-check"
                    size="12px"
                    rounded
                    unelevated
                    @click="$emit('onFinish',captureImage)"
                  />
                </div>
              </div>
            </q-form>
          </div>
        </div>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: 'dialogWebcame',
  data () {
    return {
      URLS: {},
      user: {},

      showDialog: true,
      loading: false,
      browserSupport: true,

      video: null,
      webcamStream: null,
      selectedCamera: null,
      captureImage: null,

      cameras: []
    }
  },
  props: {},
  beforeMount () {
    this.URLS = this.$helper.urls()
    this.user = this.$helper.getConnectedUser()

    navigator.getUserMedia = (
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia ||
      navigator.mediaDevices.getUserMedia
    )

    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      this.browserSupport = false
      this.$helper.showMessage('Ce navigateur ne supporte pas le flux video')
    }
  },
  mounted: function () {
    if (this.browserSupport) {
      this.getDevices().then(c => {
        this.cameras = c
        if (c.length > 0) {
          this.selectedCamera = c[0]
          this.startWebcam(c[0].deviceId)
        }
      }).catch(e => {
        this.$helper.showMessage("Erreur lors de l'initialisation du webcam")
      })
    }
  },
  destroyed: function () {
    this.stopWebcam()
  },
  watch: {

  },
  computed: {

  },
  methods: {
    onChangeCamera (camera) {
      this.selectedCamera = camera
      this.startWebcam(camera.deviceId)
    },
    getDevices () {
      return new Promise((resolve, reject) => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          let cams = []

          let i = 1
          devices.forEach((device) => {
            if (device.kind === 'videoinput') {
              cams.push({
                groupId: device.groupId,
                kind: device.kind,
                deviceId: device.deviceId,
                label: device.label || `Webcam ${i}`
              })

              i++
            }
          })

          resolve(cams)
        }).catch(function (err) {
          reject(err)
          //   console.log(err.name + ': ' + err.message)
        })
      })
    },

    startWebcam (deviceId) {
      if (this.cameras.length > 0) {
        this.stopWebcam().then(e => {
          const constraints = {
            video: {
              deviceId: { exact: deviceId }
              // width: 4096,
              // height: 2160
            },
            audio: false
          }

          navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
              this.video = document.querySelector('video')
              this.video.srcObject = stream
              this.webcamStream = stream
            }).catch(e => {
              // console.log(e)
              this.$helper.showMessage(`Erreur survenue; Vérifiez si la permission d'accès au camera est activée`, 2)
            })
        })
      } else {
        this.$helper.showMessage('Aucun webcam detecté')
      }
    },

    stopWebcam () {
      return new Promise((resolve, reject) => {
        if (this.video && this.webcamStream) {
          let tracks = this.webcamStream.getVideoTracks()
          //   stream.getVideoTracks()

          for (let i = 0; i < tracks.length; i++) {
            tracks[i].stop()
          }

          this.video.srcObject = null
          this.webcamStream = null
          this.captureImage = null

          resolve(true)
        } else {
          resolve(true)
        }
      })
    },

    getCaptureImage () {
      let canvas = document.createElement('canvas')
      canvas.setAttribute('width', 500)
      canvas.setAttribute('height', 380)

      canvas.getContext('2d').drawImage(this.video, 0, 0, canvas.width, canvas.height)
      this.captureImage = canvas.toDataURL('image/jpeg')
    }
  }

}
</script>

<style lang="stylus"></style>
