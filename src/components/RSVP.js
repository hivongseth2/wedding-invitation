"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2 } from "lucide-react"
import SpotlightCard from "./SpotlightCard/SpotlightCard"

export default function RSVP() {
  const rsvpRef = useRef(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    attending: "yes",
    guests: "0",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states with GSAP
      gsap.set(".rsvp-title, .rsvp-desc", { opacity: 0, y: 30 })
      gsap.set(".rsvp-card", { opacity: 0, y: 100 })
      gsap.set(".form-element", { opacity: 0, y: 30 })
      gsap.set(".submit-button", { opacity: 0, y: 20, scale: 0.9 })

      // Header animation
      gsap.to(".rsvp-title", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: ".rsvp-section",
          start: "top 80%",
        },
      })

      gsap.to(".rsvp-desc", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.2,
        scrollTrigger: {
          trigger: ".rsvp-section",
          start: "top 80%",
        },
      })

      // Card animation
      gsap.to(".rsvp-card", {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".rsvp-card",
          start: "top 80%",
        },
      })

      // Form elements animation
      const formElements = gsap.utils.toArray(".form-element")

      gsap.to(formElements, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        delay: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".rsvp-form",
          start: "top 80%",
        },
      })

      // Button animation
      gsap.to(".submit-button", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: 1.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".rsvp-form",
          start: "top 70%",
        },
      })

      // Success message animation
      if (isSubmitted) {
        gsap.set(".success-icon", { opacity: 0, scale: 0.5 })
        gsap.set(".success-title, .success-message", { opacity: 0, y: 20 })

        gsap.to(".success-icon", {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
        })

        gsap.to(".success-title", {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.4,
          ease: "power2.out",
        })

        gsap.to(".success-message", {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.7,
          ease: "power2.out",
        })
      }
    }, rsvpRef)

    return () => ctx.revert()
  }, [isSubmitted])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData)

    // Show success message
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        attending: "yes",
        guests: "0",
        message: "",
      })
    }, 3000)
  }

  return (
    <section id="rsvp" ref={rsvpRef} className="rsvp-section py-20 bg-secondary/50 relative overflow-hidden">

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="rsvp-title font-playfair text-4xl md:text-5xl text-gold mb-4">RSVP</h2>
          <p className="rsvp-desc font-montserrat text-muted-foreground max-w-2xl mx-auto">
            Vui lòng xác nhận tham dự trước ngày 15/12/2024 để chúng tôi có thể chuẩn bị chu đáo nhất.
          </p>
        </div>

        <SpotlightCard className="rsvp-card max-w-2xl mx-auto glass rounded-lg shadow-lg overflow-hidden text-white" spotlightColor="#880E4F">
          <div className="p-8">
            {isSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle2 className="success-icon h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="success-title font-playfair text-2xl text-foreground mb-2">Cảm ơn bạn!</h3>
                <p className="success-message font-montserrat text-muted-foreground">
                  Chúng tôi đã nhận được phản hồi của bạn và rất mong được gặp bạn trong ngày trọng đại.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rsvp-form space-y-6">


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-element space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="border-gold/30 focus:border-gold"
                    />
                  </div>

                  <div className="form-element space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="border-gold/30 focus:border-gold"
                    />
                  </div>
                </div>

                <div className="form-element space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="border-gold/30 focus:border-gold"
                  />
                </div>

                <div className="form-element space-y-2">
                  <Label>Bạn sẽ tham dự?</Label>
                  <RadioGroup
                    value={formData.attending}
                    onValueChange={(value) => handleSelectChange("attending", value)}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="attending-yes" />
                      <Label htmlFor="attending-yes">Có, tôi sẽ tham dự</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="attending-no" />
                      <Label htmlFor="attending-no">Rất tiếc, tôi không thể tham dự</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="maybe" id="attending-maybe" />
                      <Label htmlFor="attending-maybe">Tôi chưa chắc chắn</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="form-element space-y-2">
                  <Label htmlFor="guests">Số người đi cùng</Label>
                  <Select value={formData.guests} onValueChange={(value) => handleSelectChange("guests", value)}>
                    <SelectTrigger className="border-gold/30 focus:border-gold">
                      <SelectValue placeholder="Chọn số người" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-element space-y-2">
                  <Label htmlFor="message">Lời nhắn</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="border-gold/30 focus:border-gold"
                  />
                </div>

                <div className="text-center">
                  <Button
                    type="submit"
                    className="submit-button bg-gradient-to-r from-gold to-gold-light hover:from-gold/90 hover:to-gold-light/90 text-white font-montserrat py-6 px-8 rounded-full"
                  >
                    Gửi xác nhận
                  </Button>
                </div>
              </form>
            )}
          </div>
        </SpotlightCard>
      </div>
    </section>
  )
}

