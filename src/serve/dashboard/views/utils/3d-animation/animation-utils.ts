import { Three } from '../../../../../deps.ts'
const {
  LineBasicMaterial, LineDashedMaterial, BufferGeometry, CircleGeometry, CylinderGeometry,
  Group, Line, Vector3, MeshLambertMaterial, Mesh, EdgesGeometry, LineSegments, DoubleSide
} = Three

class LineMesh extends Line {
  data: any

  constructor ({
    color = '#000',
    dashed = false,
    dashOpts = {},
    points = []
  }: {
    color?: string,
    dashed?: boolean,
    dashOpts?: any,
    points?: any[]
  }) {
    const geometry = new BufferGeometry().setFromPoints(
      points.map(({ x, y, z }) => new Vector3(x, y, z))
    )
    const material = dashed
      ? new LineDashedMaterial({ color, ...Object.assign({ gapSize: 1, dashSize: 1 }, dashOpts) })
      : new LineBasicMaterial({ color })

    super(geometry, material)
    this.data = { geometry, material }

    if (dashed) { (this as any).computeLineDistances() }
  }
}

class Axes extends Group {
  constructor ({ length = 50, color = '#000000', dashed = false, dashOpts = {} }: {
    length?: number,
    color?: string,
    dashed?: boolean,
    dashOpts?: any
  }) {
    const xAxis = new LineMesh({
      color, dashed, dashOpts, points: [{ x: 0, y: 0, z: 0 }, { x: length, y: 0, z: 0 }]
    })
    const yAxis = new LineMesh({
      color, dashed, dashOpts, points: [{ x: 0, y: 0, z: 0 }, { x: 0, y: length, z: 0 }]
    })
    const zAxis = new LineMesh({
      color, dashed, dashOpts, points: [{ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: length }]
    })

    super()
    super.add(xAxis, yAxis, zAxis)
  }
}

class CombineWithEdge extends Group {
  data: any

  constructor ({
    mesh = null, geometry = null, material = null,
    edgeColor = '#000000', shadow = false, edgeOpacity = 1
  }: {
    mesh?: any,
    geometry?: any,
    material?: any,
    edgeColor?: string,
    shadow?: boolean,
    edgeOpacity?: number
  }) {
    const originalMesh: any = mesh || new Mesh(geometry, material)
    if (mesh) {
      geometry = (mesh as any).geometry
      material = (mesh as any).material
    }
    originalMesh.castShadow = shadow

    // edges
    const edges = new EdgesGeometry(geometry)
    const edgesMesh = new LineSegments(edges, new LineBasicMaterial({ color: edgeColor, transparent: true, opacity: edgeOpacity }))

    super()
    ;(this as any).add(originalMesh)
    ;(this as any).add(edgesMesh)
    this.data = { geometry, material }
  }
}

class Edgify extends LineSegments {
  data: any

  constructor ({
    color = '#000000', geometry = null
  }: {
    color?: string,
    geometry?: any
  }) {
    const edgeGeometry = new EdgesGeometry(geometry)
    const material = new LineBasicMaterial({ color })

    super(edgeGeometry, material)
    this.data = { geometry, material }
  }
}

class Column extends Group {
  constructor ({
    sideColor = '#000000',
    faceColor = '#000000',
    edgeColor = '#000000',
    radius = 1,
    height = 1
  }) {
    const MaterialCommon = MeshLambertMaterial

    const faceGeometry = new CircleGeometry(radius, 64, 0, 2 * Math.PI)
    const faceMaterial = new MaterialCommon({
      color: faceColor,
      side: DoubleSide,
      transparent: true,
      opacity: 1
    })
    const faceTop = new CombineWithEdge({ geometry: faceGeometry, material: faceMaterial, edgeColor })
    const faceBottom = new CombineWithEdge({ geometry: faceGeometry, material: faceMaterial })

    ;(faceTop as any).rotation.x = Math.PI / 2 * -1
    ;(faceTop as any).position.set(0, height, 0)
    ;(faceBottom as any).rotation.x = Math.PI / 2 * -1

    const cylinder = new Mesh(
      new CylinderGeometry(radius, radius, height, 64, 1, true),
      new MaterialCommon({ color: sideColor, side: DoubleSide, transparent: true, opacity: 1 })
    )
    cylinder.position.y = height / 2

    super()
    super.add(faceTop, faceBottom, cylinder)
  }
}

function resizeRendererToDisplaySize (renderer: any): boolean {
  const pixelRatio = window.devicePixelRatio || 1
  const canvasEl = renderer.domElement
  const [desiredWidth, desiredHeight] = [canvasEl.clientWidth * pixelRatio, canvasEl.clientHeight * pixelRatio]
  const needResize = canvasEl.width !== desiredWidth || canvasEl.height !== desiredHeight

  if (needResize) {
    renderer.setSize(desiredWidth, desiredHeight, false)
  }

  return needResize
}

function adjustCameraAspect (canvasEl: any, camera: any): void {
  camera.aspect = canvasEl.clientWidth / canvasEl.clientHeight
  camera.updateProjectionMatrix()
}

function randomFromMinMax (min = 0, max = 0) {
  return min + (max - min) * Math.random()
}

function degreeToRadian (deg: number): number {
  return deg * (Math.PI / 180)
}

export {
  resizeRendererToDisplaySize,
  adjustCameraAspect,
  randomFromMinMax,
  degreeToRadian,
  LineMesh,
  CombineWithEdge,
  Edgify,
  Column,
  Axes
}
