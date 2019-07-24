
// Get canvas
const $canvas = document.querySelector('canvas')
const context = $canvas.getContext('2d')

// Hexagone
class Hexagone
{
  constructor(x, y, radius, fill, stroke)
  {
    this.x      = x
    this.y      = y
    this.radius = radius
    this.height = Math.sqrt(this.radius ** 2 - (this.radius / 2) ** 2)
    this.fill   = fill
    this.stroke = stroke
    this.draw()
  }

  draw()
  {
    // Draw hexagone
    context.beginPath()
    context.moveTo(this.x + this.radius,     this.y)
    context.lineTo(this.x + this.radius / 2, this.y - this.height)
    context.lineTo(this.x - this.radius / 2, this.y - this.height)
    context.lineTo(this.x - this.radius,     this.y)
    context.lineTo(this.x - this.radius / 2, this.y + this.height)
    context.lineTo(this.x + this.radius / 2, this.y + this.height)
    context.lineTo(this.x + this.radius,     this.y)
    if (this.fill)
    {
      context.fill()
    }
    if (this.stroke)
    {    
      context.lineWidth = this.radius / 25
      context.stroke()
    }
    context.closePath()
  }
}

// Benzene
class Benzene
{
  constructor(x, y, radius, height, ratio, bond, removed)
  {
    this.x       = x
    this.y       = y
    this.radius  = radius
    this.height  = height
    this.ratio   = ratio
    this.bond    = bond
    this.removed = removed
    this.draw()
  }

  draw()
  {
    // Hexagone
    const hexagone = new Hexagone(this.x, this.y, this.radius, false, true)

    // Double bond
    context.beginPath()
    if (this.removed != 'top-right')
    {
      context.moveTo(this.x + this.ratio,     this.y)
      context.lineTo(this.x + this.ratio / 2, this.y - this.bond)
    }
    if (this.removed != 'top-left')
    {
      context.moveTo(this.x - this.ratio / 2, this.y - this.bond)
      context.lineTo(this.x - this.ratio,     this.y)
    }
    if (this.removed != 'bottom')
    {
      context.moveTo(this.x - this.ratio / 2, this.y + this.bond)
      context.lineTo(this.x + this.ratio / 2, this.y + this.bond)
    }
    context.lineWidth = this.radius / 25
    context.stroke()
    context.closePath()
  }
}

// Molecule
class Molecule
{
  constructor(name)
  {
    $canvas.width  = window.innerWidth
    $canvas.height = window.innerHeight
    this.translate = 0
    this.name      = name
    this.init()
    this.draw()
  }

  init()
  {
    // Initialize parameters
    this.radius = Math.floor(Math.random() * 12.5 + 12.5)
    this.x      = Math.floor(Math.random() * $canvas.width)
    this.y      = - this.radius - Math.floor(Math.random() * $canvas.height)
    this.height = Math.sqrt(this.radius ** 2 - (this.radius / 2) ** 2)
    this.ratio  = this.radius * 0.75
    this.bond   = Math.sqrt((this.radius * 0.75) ** 2 - ((this.radius * 0.75 )/ 2) ** 2)
    this.angle  = Math.floor(Math.random() * Math.PI)
    this.rotate = (Math.floor(Math.random() * 10) / 1000) * (this.x < $canvas.width / 2 ? - 1 : 1)
    this.speed  = Math.floor(Math.random() * 1) + 1.25
  }

  draw()
  {
    // Draw molecule
    context.save()
    context.translate(this.x, this.y)
    context.rotate(this.angle)
    context.translate(- this.x, - this.y)

    if (this.name == 'benzene')
    {
      const benzene = new Benzene(this.x, this.y, this.radius, this.height, this.ratio, this.bond, undefined)
      this.size = this.radius
    }
    else if (this.name == 'naphtalene')
    {
      const benzene_1 = new Benzene(this.x, this.y - this.height, this.radius, this.height,   this.ratio,   this.bond, undefined)
      const benzene_2 = new Benzene(this.x, this.y + this.height, this.radius, this.height, - this.ratio, - this.bond, 'bottom')
      this.size = this.radius * 4
    }
    else if (this.name == 'diphenyle')
    {
      const benzene_1 = new Benzene(this.x - this.radius * 1.5, this.y, this.radius, this.height,   this.ratio,   this.bond, undefined)
      const benzene_2 = new Benzene(this.x + this.radius * 1.5, this.y, this.radius, this.height, - this.ratio, - this.bond, undefined)
      context.beginPath()
      context.moveTo(this.x - this.radius / 2, this.y)
      context.lineTo(this.x + this.radius / 2, this.y)
      context.stroke()
      context.closePath()
      this.size = this.radius * 5
    }
    else if (this.name == 'styrene')
    {
      const benzene = new Benzene(this.x, this.y, this.radius, this.height, this.ratio, this.bond, undefined)
      context.beginPath()
      context.moveTo(this.x + this.radius,                      this.y)
      context.lineTo(this.x + this.radius * 2,                  this.y)
      context.lineTo(this.x + this.radius * 2.5,                this.y + this.height)
      context.moveTo(this.x + this.radius * 3 - this.ratio,     this.y)
      context.lineTo(this.x + this.radius * 3 - this.ratio / 2, this.y + this.bond)
      context.stroke()
      context.closePath()
      this.size = this.radius * 4
    }
    else if (this.name == 'coronene')
    {
      const benzene_1 = new Benzene(this.x,                     this.y - this.height * 2, this.radius, this.height, - this.ratio, - this.bond, 'top-left')
      const benzene_2 = new Benzene(this.x - this.radius * 1.5, this.y - this.height,     this.radius, this.height,   this.ratio,   this.bond, 'top-right')
      const benzene_3 = new Benzene(this.x - this.radius * 1.5, this.y + this.height,     this.radius, this.height, - this.ratio, - this.bond, 'bottom')
      const benzene_4 = new Benzene(this.x,                     this.y + this.height * 2, this.radius, this.height,   this.ratio,   this.bond, 'top-left')
      const benzene_5 = new Benzene(this.x + this.radius * 1.5, this.y + this.height,     this.radius, this.height, - this.ratio, - this.bond, 'top-right')
      const benzene_6 = new Benzene(this.x + this.radius * 1.5, this.y - this.height,     this.radius, this.height,   this.ratio,   this.bond, 'bottom')
      this.size = this.radius * 6
    }
    context.restore()
  }
}

// Canvas
class Canvas
{
  constructor(molecules)
  {
    if ($canvas != undefined)
    {
      this.molecules = molecules
      this.setResize()
    }
  }

  setResize()
  {
    // Resize canvas
    const resize = () =>
    {
      $canvas.width  = window.innerWidth
      $canvas.height = window.innerHeight
      this.largest   = Math.max($canvas.width, $canvas.height)
      $canvas.style.position = 'absolute'
    }
    resize()

    window.addEventListener('resize', resize)
  }

  setFrame()
  {
    context.clearRect(0, 0, $canvas.width, $canvas.height)

    // Draw molecules
    for (const molecule of this.molecules)
    {
      const opacity = 1 - (molecule.y + molecule.size) / $canvas.height
      context.strokeStyle = `rgb(122, 175, 163, ${opacity})`
      molecule.draw()

      // Update parameters
      molecule.translate = Math.E ** (((molecule.y + $canvas.height) / (2 * $canvas.height)) * molecule.speed)
      molecule.y     += molecule.translate
      molecule.angle += molecule.rotate
      if
        (
          molecule.x + molecule.size < 0             ||
          molecule.x - molecule.size > $canvas.width ||
          molecule.y - molecule.size > $canvas.height
        )
      {
        molecule.init()
      }
    }
  }
}

// Create molecules
const number    = 5
const molecules = new Array()
for (let i = 0; i < number; i++)
{
  const benzene    = new Molecule('benzene')
  const naphtalene = new Molecule('naphtalene')
  const diphenyle  = new Molecule('diphenyle')
  const styrene    = new Molecule('styrene')
  const coronene   = new Molecule('coronene')
  molecules.push(benzene)
  molecules.push(naphtalene)
  molecules.push(diphenyle)
  molecules.push(styrene)
  molecules.push(coronene)
}

// Animation
const canvas = new Canvas(molecules)

class Animation
{
  constructor()
  {
    this.setAnimation()
  }

  setAnimation()
  {
    // Set animation frame
    const loop = () =>
    {
      canvas.setFrame()
      window.requestAnimationFrame(loop)
    }
    loop()
  }
}

const animation = new Animation()













