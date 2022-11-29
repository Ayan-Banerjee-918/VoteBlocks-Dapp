import { Buffer } from "buffer"

const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"

const toBase32 = input => {
  let offset = 0

  const _toBase32 = input => {
    let output = ""

    for (offset = 0; offset < input.length; ) {
      const { encoded, numberOfBytes } = _getNextGroup(input)

      output += numberOfBytes >= 1 ? base32Chars[encoded[0]] : "="
      output += numberOfBytes >= 2 ? base32Chars[encoded[1]] : "="
      output += numberOfBytes >= 3 ? base32Chars[encoded[2]] : "="
      output += numberOfBytes >= 4 ? base32Chars[encoded[3]] : "="
      output += numberOfBytes >= 5 ? base32Chars[encoded[4]] : "="
      output += numberOfBytes >= 6 ? base32Chars[encoded[5]] : "="
      output += numberOfBytes >= 7 ? base32Chars[encoded[6]] : "="
      output += numberOfBytes >= 8 ? base32Chars[encoded[7]] : "="
    }

    return output
  }

  const _getNextGroup = input => {
    const encoded = new Uint8Array(8)
    const bitGroup = new Uint32Array(5)

    let numberOfBytes

    switch (input.length - offset) {
      case 1:
        numberOfBytes = 2
        break
      case 2:
        numberOfBytes = 4
        break
      case 3:
        numberOfBytes = 5
        break
      case 4:
        numberOfBytes = 7
        break
      default:
        numberOfBytes = 8
        break
    }

    bitGroup[0] = offset < input.length ? input[offset++] : 0
    bitGroup[1] = offset < input.length ? input[offset++] : 0
    bitGroup[2] = offset < input.length ? input[offset++] : 0
    bitGroup[3] = offset < input.length ? input[offset++] : 0
    bitGroup[4] = offset < input.length ? input[offset++] : 0

    encoded[0] = bitGroup[0] >> 3
    encoded[1] = ((bitGroup[0] & 0x07) << 2) | (bitGroup[1] >> 6)
    encoded[2] = (bitGroup[1] >> 1) & 0x1f
    encoded[3] = ((bitGroup[1] & 0x01) << 4) | (bitGroup[2] >> 4)
    encoded[4] = ((bitGroup[2] & 0x0f) << 1) | (bitGroup[3] >> 7)
    encoded[5] = (bitGroup[3] >> 2) & 0x1f
    encoded[6] = ((bitGroup[3] & 0x3) << 3) | (bitGroup[4] >> 5)
    encoded[7] = bitGroup[4] & 0x1f

    return { encoded, numberOfBytes }
  }

  if (typeof input === "string") {
    const buffer = Buffer.from(input, "utf-8")
    const bytes = new Uint8Array(
      buffer.buffer,
      buffer.byteOffset,
      buffer.length / Uint8Array.BYTES_PER_ELEMENT
    )

    return toBase32(bytes)
  }

  return _toBase32(input)
}

const fromBase32 = input => {
  input = input.replace(new RegExp("[=]+$"), "").toUpperCase()

  if (input.length == 0) return Buffer.alloc(0)

  const output = new Uint8Array((input.length * 5) / 8)
  let bitIndex = 0
  let inputIndex = 0
  let outputBits = 0
  let outputIndex = 0

  while (outputIndex < output.length) {
    const byteIndex = base32Chars.indexOf(input[inputIndex])

    if (byteIndex < 0) {
      throw new Error("Format error")
    }

    const bits = Math.min(5 - bitIndex, 8 - outputBits)

    output[outputIndex] <<= bits
    output[outputIndex] |= byteIndex >> (5 - (bitIndex + bits))

    bitIndex += bits
    if (bitIndex >= 5) {
      inputIndex++
      bitIndex = 0
    }

    outputBits += bits
    if (outputBits >= 8) {
      outputIndex++
      outputBits = 0
    }
  }

  return Buffer.from(output)
}

export default { toBase32, fromBase32 }
