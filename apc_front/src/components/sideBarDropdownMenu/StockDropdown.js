import React, { useCallback } from "react"
import { useNavigate } from "react-router-dom"

export default function StoreDropdown() {
  const navigate = useNavigate()

  const handleClickMain = useCallback(() => {
    navigate({ pathname: '/store/coldStorage' })
  }, [navigate])

  const handleClickAnalysis = useCallback(() => {
    navigate({ pathname: "/analysisStock" })
  }, [navigate])

  const dropdownstyle = "flex items-center p-1  rounded-lg text-sub hover:bg-hov transition-colors duration-300 cursor-pointer"
  return (
    <div>
      <a className={dropdownstyle} onClick={handleClickAnalysis}>
        <span className="flex-1 ml-10 whitespace-nowrap">보관 현황</span>
      </a>
    </div>
  )
}
