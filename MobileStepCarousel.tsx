import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

interface Step {
    title: string
    body: string
    image: { src: string } | string
}

interface Props {
    steps: Step[]
    cardWidthPct: number
    gap: number
    activeColor: string
    inactiveColor: string
    titleColor: string
    bodyColor: string
    cardBg: string
    cardRadius: number
}

export default function MobileStepCarousel(props: Props) {
    const {
        steps = [],
        cardWidthPct = 85,
        gap = 12,
        activeColor = "#00DDA3",
        inactiveColor = "#D4D4D4",
        titleColor = "#111418",
        bodyColor = "#4E5255",
        cardBg = "#FFFFFF",
        cardRadius = 16,
    } = props

    const scrollerRef = useRef<HTMLDivElement>(null)
    const [active, setActive] = useState(0)

    useEffect(() => {
        const el = scrollerRef.current
        if (!el) return
        let raf = 0
        const onScroll = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(() => {
                const w = el.clientWidth
                const idx = Math.round(el.scrollLeft / w)
                setActive(Math.max(0, Math.min(idx, steps.length - 1)))
            })
        }
        el.addEventListener("scroll", onScroll, { passive: true })
        return () => {
            el.removeEventListener("scroll", onScroll)
            cancelAnimationFrame(raf)
        }
    }, [steps.length])

    const goTo = (i: number) => {
        const el = scrollerRef.current
        if (!el) return
        el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" })
    }

    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 16,
            }}
        >
            <div
                ref={scrollerRef}
                style={{
                    width: "100%",
                    display: "flex",
                    gap,
                    overflowX: "auto",
                    overflowY: "hidden",
                    scrollSnapType: "x mandatory",
                    scrollbarWidth: "none",
                    WebkitOverflowScrolling: "touch",
                    paddingInline: `${(100 - cardWidthPct) / 2}%`,
                }}
                className="msc-scroller"
            >
                <style>{`.msc-scroller::-webkit-scrollbar{display:none}`}</style>

                {steps.map((step, i) => {
                    const imgSrc =
                        typeof step.image === "string"
                            ? step.image
                            : step.image?.src
                    return (
                        <div
                            key={i}
                            style={{
                                flex: `0 0 ${cardWidthPct}%`,
                                scrollSnapAlign: "center",
                                background: cardBg,
                                borderRadius: cardRadius,
                                padding: 16,
                                display: "flex",
                                flexDirection: "column",
                                gap: 12,
                                boxShadow:
                                    "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 17,
                                    fontWeight: 600,
                                    lineHeight: 1.3,
                                    color: titleColor,
                                }}
                            >
                                {step.title}
                            </div>
                            <div
                                style={{
                                    fontSize: 14,
                                    lineHeight: 1.5,
                                    color: bodyColor,
                                }}
                            >
                                {step.body}
                            </div>
                            {imgSrc && (
                                <div
                                    style={{
                                        width: "100%",
                                        aspectRatio: "0.55",
                                        borderRadius: 20,
                                        overflow: "hidden",
                                        marginTop: 4,
                                        background: "#F5F5F5",
                                    }}
                                >
                                    <img
                                        src={imgSrc}
                                        alt={step.title}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 6,
                    paddingBlock: 4,
                }}
            >
                {steps.map((_, i) => {
                    const isActive = i === active
                    return (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            aria-label={`Đi tới bước ${i + 1}`}
                            style={{
                                width: isActive ? 24 : 8,
                                height: 8,
                                borderRadius: 999,
                                background: isActive
                                    ? activeColor
                                    : inactiveColor,
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                                transition:
                                    "width 240ms cubic-bezier(0.4,0,0.2,1), background 240ms",
                            }}
                        />
                    )
                })}
            </div>
        </div>
    )
}

addPropertyControls(MobileStepCarousel, {
    steps: {
        type: ControlType.Array,
        title: "Steps",
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, defaultValue: "1. Title" },
                body: {
                    type: ControlType.String,
                    displayTextArea: true,
                    defaultValue: "Step description.",
                },
                image: { type: ControlType.ResponsiveImage },
            },
        },
        defaultValue: [
            {
                title: "1. Mở ví V-SmartPay",
                body: 'Tại màn hình chủ, bạn sẽ thấy banner "Sinh lời mỗi ngày". Bấm vào nút "Khám phá ngay" để tìm hiểu sản phẩm V-Smart Save.',
            },
            {
                title: "2. Tìm hiểu sản phẩm",
                body: 'Xem các thông tin về lợi ích: lợi suất lên đến 5%/năm, cách tính tiền lời và thời điểm nhận tiền. Bấm "Tiếp tục" để qua bước tiếp theo.',
            },
            {
                title: "3. Xác nhận thông tin",
                body: 'Kiểm tra thông tin khách hàng và tóm tắt sản phẩm (sinh lời 5%/năm, số dư tối đa 100.000.000đ, rút tiền tức thì miễn phí). Chọn chấp nhận chính sách và bấm "Tiếp tục".',
            },
            {
                title: "4. Đăng ký thành công",
                body: 'V-Smart Save đã được kích hoạt. Bấm "Nạp tiền ngay" để bắt đầu sinh lời, hoặc "Chi tiết sinh lời" để vào trang chủ sản phẩm.',
            },
        ],
    },
    cardWidthPct: {
        type: ControlType.Number,
        title: "Card Width %",
        defaultValue: 85,
        min: 60,
        max: 100,
        step: 1,
        unit: "%",
    },
    gap: {
        type: ControlType.Number,
        title: "Card Gap",
        defaultValue: 12,
        min: 0,
        max: 40,
        unit: "px",
    },
    activeColor: {
        type: ControlType.Color,
        title: "Active Dot",
        defaultValue: "#00DDA3",
    },
    inactiveColor: {
        type: ControlType.Color,
        title: "Inactive Dot",
        defaultValue: "#D4D4D4",
    },
    titleColor: {
        type: ControlType.Color,
        title: "Title",
        defaultValue: "#111418",
    },
    bodyColor: {
        type: ControlType.Color,
        title: "Body",
        defaultValue: "#4E5255",
    },
    cardBg: {
        type: ControlType.Color,
        title: "Card BG",
        defaultValue: "#FFFFFF",
    },
    cardRadius: {
        type: ControlType.Number,
        title: "Card Radius",
        defaultValue: 16,
        min: 0,
        max: 40,
        unit: "px",
    },
})

MobileStepCarousel.displayName = "Mobile Step Carousel"
